import React from 'react';
import { Typography, Button } from '@material-ui/core';
import Link from 'next/link';
import { Call } from '~/firebase/schema-types';

export default function SummaryContainer({ callId, call }: { callId: string; call: Call }) {
  return (
    <>
      {call.state === 'started' && (
        <>
          <Typography>The call has started, join call</Typography>
          <Link href={`/call/${callId}/room`}>
            <Button>Join</Button>
          </Link>
        </>
      )}
      {call.state === 'finished' && (
        <>
          <Typography>The call has ended, view summary</Typography>
          <Link href={`/call/${callId}/summary`}>
            <Button>Summary</Button>
          </Link>
        </>
      )}
    </>
  );
}
