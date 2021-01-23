import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { LocalModel, CallData } from '~/firebase/schema-types';

export default function DataCard({ data }: { data: { [key: string]: CallData } }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h2">Data</Typography>
      </CardContent>
    </Card>
  );
}
