import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { LocalModel, Call } from '~/firebase/schema-types';
import type { ParticipantRecord } from './types';

export default function CallCard({
  call,
  participants,
}: {
  call: LocalModel<Call>;
  participants: ParticipantRecord[];
}) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h2">Call</Typography>
        {JSON.stringify(participants)}
      </CardContent>
    </Card>
  );
}
