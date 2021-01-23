import React, { useState, useEffect } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Twilio } from 'twilio';

import { Collections, LocalModel, Call, CallData } from '~/firebase/schema-types';
import { db, rtdb } from '~/utils/firebase';
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

  // fetch call data
  useEffect(() => {
    if (!callId) {
      return;
    }

    const valueRef = rtdb.ref(`calls/${callId}`);
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

  // fetch participants from Twilio API
  const participantRecords = await twilioClient.video.rooms(callId).participants.list();
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
