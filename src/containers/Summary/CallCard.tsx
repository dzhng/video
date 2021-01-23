import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { LocalModel, Call } from '~/firebase/schema-types';

export default function CallCard({ call }: { call: LocalModel<Call> }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h2">Call</Typography>
      </CardContent>
    </Card>
  );
}
