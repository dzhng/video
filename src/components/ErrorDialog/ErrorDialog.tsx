import React from 'react';
import { TwilioError } from 'twilio-video';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from '@material-ui/core';

import { useAppState } from '~/state';
import enhanceMessage from './enhanceMessage';

export default function ErrorDialog() {
  const { error, setError } = useAppState();

  const enhancedMessage: string | null =
    error instanceof TwilioError
      ? enhanceMessage(error.message, error.code)
      : error instanceof Error
      ? error.message
      : error;

  return (
    <Dialog open={error !== null} onClose={() => setError(null)} fullWidth={true} maxWidth="xs">
      <DialogTitle>ERROR</DialogTitle>
      <DialogContent>
        <DialogContentText data-testid="content-text">{enhancedMessage}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setError(null)} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
