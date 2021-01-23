import React, { useState, useEffect } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Twilio } from 'twilio';

import { Collections, LocalModel, Template, Call, CallData } from '~/firebase/schema-types';
import { db, rtdb } from '~/utils/firebase';
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
  const [template, setTemplate] = useState<LocalModel<Template>>();
  const [callData, setCallData] = useState<RootCallData>();

  const callId = String(router.query.slug);
  const fromHref = String(router.query.fromHref);

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

  // fetch template model
  useEffect(() => {
    if (!call) {
      return;
    }

    const unsubscribe = db
      .collection(Collections.TEMPLATES)
      .doc(call.templateId)
      .onSnapshot((result) => {
        setTemplate({
          id: result.id,
          ...(result.data() as Template),
        });
      });

    return unsubscribe;
  }, [call]);

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
    <SummaryContainer
      template={template}
      call={call}
      data={callData}
      participants={participants}
      fromHref={fromHref}
    />
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

  if (rooms.length === 0) {
    return { notFound: true };
  }

  // ideally there should just be one room per unique name, if there are multiple it means
  // the room was created / destroyed throughout the call, and somehow the webhook didn't
  // catch it and ended the call.
  // If this is the case, use the one with highest duration
  const room = rooms.sort((a, b) => b.duration - a.duration)[0];

  // fetch participants from Twilio API
  const participantRecords = await twilioClient.video.rooms(room.sid).participants.list();
  const participants = participantRecords.map((record) => {
    const data: ParticipantRecord = {
      uid: record.identity,
      joinTime: record.startTime.getTime(),
      leaveTime: record.endTime.getTime(),
      duration: record.duration,
    };
    return data;
  });

  return { props: { participants } };
};
