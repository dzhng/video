import React from 'react';
import { Typography, Button } from '@material-ui/core';
import Link from 'next/link';
import { Call } from '~/firebase/schema-types';

export default function SummaryContainer({ call }: { call: Call }) {
  return (
    <>
      {call.state === 'started' && (
        <>
          <Typography>The call has started, join call</Typography>
          <Link href={`/call/${call.id}/room`}>
            <Button>Join</Button>
          </Link>
        </>
      )}
      {call.state === 'finished' && (
        <>
          <Typography>The call has ended, view summary</Typography>
          <Link href={`/call/${call.id}/summary`}>
            <Button>Summary</Button>
          </Link>
        </>
      )}
    </>
  );
}
