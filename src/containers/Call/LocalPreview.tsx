import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import LocalPreviewCard from './LocalPreviewCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: theme.palette.grey[900],
      height: '100%',
    },
    card: {
      width: '50%',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: theme.modalWidth,
    },
  }),
);

export default function LocalPreview({ actionBar }: { actionBar?: JSX.Element }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <LocalPreviewCard className={classes.card} actionBar={actionBar} />
    </div>
  );
}
