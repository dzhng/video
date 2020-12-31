import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => createStyles({}));

export default function WaitForHost() {
  const classes = useStyles();

  return <>Wait Screen</>;
}
