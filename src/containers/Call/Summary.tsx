import React from 'react';
import { Container, Typography, Button } from '@material-ui/core';
import Link from 'next/link';
import { Call } from '~/firebase/schema-types';

export default function SummaryContainer({ call }: { call: Call }) {
  return (
    <Container>
      <Link href="edit">
        <Button>Edit Call</Button>
      </Link>
      <Typography>Call</Typography>
      {call}
    </Container>
  );
}
