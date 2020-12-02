import React from 'react';
import { CircularProgress } from '@material-ui/core';

import { useAppState } from '~/state';

export default function PendingWrite() {
  const { isWriting } = useAppState();

  return isWriting ? <CircularProgress color="primary" variant="indeterminate" /> : null;
}
