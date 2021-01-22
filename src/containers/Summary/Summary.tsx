import React from 'react';
import { Container, Typography } from '@material-ui/core';
import { LocalModel, Call, CallData } from '~/firebase/schema-types';

export default function SummaryContainer({
  call,
  data,
  fromHref,
}: {
  call: LocalModel<Call>;
  data: { [key: string]: CallData };
  fromHref?: string;
}) {
  return (
    <Container>
      <Typography variant="h1">
        <b>Call Summary</b>
      </Typography>
      {JSON.stringify(call)}
      {JSON.stringify(data)}
    </Container>
  );
}
