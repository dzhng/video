import React, { PropsWithChildren } from 'react';
import { TwilioError } from 'twilio-video';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from '@material-ui/core';
import enhanceMessage from './enhanceMessage';

interface ErrorDialogProps {
  dismissError: Function;
  error: TwilioError | null;
}

export default function ErrorDialog({ dismissError, error }: PropsWithChildren<ErrorDialogProps>) {
  const { message, code } = error || {};
  const enhancedMessage = enhanceMessage(message, code);

  return (
    <Dialog open={error !== null} onClose={() => dismissError()} fullWidth={true} maxWidth="xs">
      <DialogTitle>ERROR</DialogTitle>
      <DialogContent>
        <DialogContentText data-testid="content-text">{enhancedMessage}</DialogContentText>
        {code && (
          <pre>
            <code data-testid="code">Error Code: {code}</code>
          </pre>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dismissError()} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
