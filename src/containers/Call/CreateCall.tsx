import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => createStyles({}));

export default function CreateCall({ create }: { create(): Promise<boolean> }) {
  const classes = useStyles();

  return <>Create Call Screen</>;
}
