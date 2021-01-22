import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Snackbar, SnackbarProps, Slide } from '@material-ui/core';
import { Alert as MuiAlert, AlertProps } from '@material-ui/lab';
import { randomTip } from './tips';

const useStyles = makeStyles((theme) =>
  createStyles({
    snackbar: {
      position: 'absolute',
    },
    close: {
      padding: theme.spacing(0.5),
    },
  }),
);

const Alert = React.forwardRef(function Alert(props: AlertProps, ref) {
  return <MuiAlert ref={ref} elevation={6} variant="filled" {...props} />;
});

export default function TipsSnackBar() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [tip, setTip] = useState('');

  useEffect(() => {
    setTip(randomTip());
  }, []);

  return (
    <Snackbar
      className={classes.snackbar}
      open={open}
      onClose={() => setOpen(false)}
      autoHideDuration={10000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'down' } as SnackbarProps['TransitionProps']}
    >
      <Alert severity="info" onClose={() => setOpen(false)}>
        <b>Quick Tip: </b>
        {tip}
      </Alert>
    </Snackbar>
  );
}
