import React from 'react';
import dynamic from 'next/dynamic';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import type { LocalPreviewCardProps } from './LocalPreviewCard';

// use dynamic import here since local preview card requires measuring dom so can't SSR
const LocalPreviewCard = dynamic(() => import('./LocalPreviewCard'), { ssr: false });

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%',
    },
    card: {
      ...theme.customMixins.modalPaper,
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 900,
    },
  }),
);

export default function LocalPreview(props: LocalPreviewCardProps) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <LocalPreviewCard className={classes.card} {...props} />
    </div>
  );
}
