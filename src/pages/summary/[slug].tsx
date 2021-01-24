import React, { useState, useEffect } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Twilio } from 'twilio';

import { Collections, LocalModel, Call, CallData } from '~/firebase/schema-types';
import { db, rtdb } from '~/utils/firebase';
import { removeUndefineds } from '~/utils';
import { CallsRTDBRoot } from '~/constants';
import LoadingContainer from '~/containers/Loading/Loading';
import SummaryContainer from '~/containers/Summary/Summary';
import type { ParticipantRecord } from '~/containers/Summary/types';

interface RootCallData {
  [key: string]: CallData;
}

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID ?? '';
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID ?? '';
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET ?? '';
const twilioClient = new Twilio(twilioApiKeySID, twilioApiKeySecret, {
  accountSid: twilioAccountSid,
});

// view call summary from call id
export default function SummaryPage({ participants }: { participants: ParticipantRecord[] }) {
  const router = useRouter();
  const [call, setCall] = useState<LocalModel<Call>>();
  const [callData, setCallData] = useState<RootCallData>();

  const callId = String(router.query.slug);
  const fromHref = router.query.fromHref as string | undefined;

  // fetch call model
  useEffect(() => {
    if (!callId) {
      return;
    }

    const unsubscribe = db
      .collection(Collections.CALLS)
      .doc(callId)
      .onSnapshot((result) => {
        setCall({
          id: result.id,
          ...(result.data() as Call),
        });
      });

    return unsubscribe;
  }, [callId]);

  // fetch call data
  useEffect(() => {
    if (!callId) {
      return;
    }

    const valueRef = rtdb.ref(`${CallsRTDBRoot}/${callId}`);
    valueRef.on('value', (snapshot) => {
      setCallData(snapshot.val() ?? {});
    });
  }, [callId]);

  if (!call || !callData) {
    return <LoadingContainer />;
  }

  return (
    <SummaryContainer call={call} data={callData} participants={participants} fromHref={fromHref} />
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const callId = String(params?.slug);
  if (!callId) {
    return { notFound: true };
  }

  // first fetch the correct room
  const rooms = await twilioClient.video.rooms.list({
    status: 'completed',
    uniqueName: callId,
    limit: 5,
  });

  // ideally there should just be one room per unique name, if there are multiple it means
  // the room was created / destroyed throughout the call, and somehow the webhook didn't
  // catch it and ended the call.
  // If this is the case, use the one with highest duration
  const sorted = rooms.sort((a, b) => b.duration - a.duration);

  // search either sid or name, depending on if call is still in-progress or completed
  let roomSidOrName = sorted.length > 0 ? sorted[0].sid : callId;

  // fetch participants from Twilio API
  const participantRecords = await twilioClient.video.rooms(roomSidOrName).participants.list();
  // no participants means room does not exist
  if (participantRecords.length === 0) {
    return { notFound: true };
  }

  const participants = participantRecords.map((record) => {
    const data: ParticipantRecord = removeUndefineds({
      uid: record.identity,
      joinTime: record.startTime.getTime(),
      leaveTime: record.endTime?.getTime(),
      duration: record.duration,
    });
    return data;
  });

  // This part looks weird, but if the rooms query returned no data, it means the
  // room must be still in-progress (because the query filter by completed).
  // Participants query will ONLY work with callId if status is in-progress, so if
  // we got participants and no completed rooms it means the room must be in-progress.
  //
  // NOTE: there's a more straight forward way to write this with another room list query,
  // but that's an extra network call so not worth the tradeoff.
  const isOngoing = sorted.length === 0;

  return { props: { participants, isOngoing } };
};
