import React from 'react';
import dynamic from 'next/dynamic';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

// use dynamic import here since local preview card requires measuring dom so can't SSR
const LocalPreviewCard = dynamic(() => import('./LocalPreviewCard'), { ssr: false });

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
      width: '90%',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: theme.modalWidth,
    },
  }),
);

export default function LocalPreview({ actionBar }: { actionBar?: React.ReactNode }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <LocalPreviewCard className={classes.card} actionBar={actionBar} />
    </div>
  );
}
