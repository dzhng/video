import React from 'react';
import { CircularProgress } from '@material-ui/core';

import usePendingWrite from '~/hooks/usePendingWrite/usePendingWrite';

export default function PendingWrite() {
  const { isWriting } = usePendingWrite();

  return isWriting ? <CircularProgress color="primary" variant="indeterminate" /> : null;
}
