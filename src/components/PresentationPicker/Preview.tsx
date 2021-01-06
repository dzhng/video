import React from 'react';
import { Grid, Typography, Divider, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Presentation } from '~/firebase/schema-types';
import { formatPastDate } from '~/utils';
import PresentationDisplay from '~/components/Presentation/Presentation';

interface PropTypes {
  presentation: Presentation;
  removePresentation(): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(1),
    },
    imageGridItem: {
      // 4/3 aspect ratio (50% and not 75% because its relative to parent el)
      width: '100%',
      paddingTop: '50% !important',
      position: 'relative',

      '& > div': {
        position: 'absolute',
        top: 0,
        left: 0,
      },
    },
    name: {
      overflowWrap: 'break-word',
    },
    info: {
      overflowWrap: 'break-word',
    },
  }),
);

export default function Preview({ presentation, removePresentation }: PropTypes) {
  const classes = useStyles();

  return (
    <Grid container className={classes.container} spacing={3}>
      <Grid item xs={8} className={classes.imageGridItem}>
        <PresentationDisplay presentation={presentation} startAt={0} />
      </Grid>

      <Grid item xs={4}>
        <Typography variant="h5" className={classes.name}>
          <b>{presentation.name}</b>
        </Typography>
        <br />
        <Divider />
        <br />
        <Typography variant="body1" className={classes.info}>
          <b>Total slides:</b> {presentation.slides.length}
        </Typography>
        <Typography variant="body1" className={classes.info}>
          <b>Uploaded:</b>{' '}
          {formatPastDate(
            (presentation.createdAt as any).toDate
              ? (presentation.createdAt as any).toDate()
              : new Date(),
          )}
        </Typography>
        <br />
        <Divider />
        <br />
        <Button variant="outlined" color="secondary" onClick={removePresentation}>
          Change
        </Button>
      </Grid>
    </Grid>
  );
}
