import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Divider } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    section: {
      margin: theme.spacing(1),
    },
    sectionTitle: {
      marginBottom: theme.spacing(1),
    },
  }),
);

const TaskSection = ({ name }: { name: string }) => {
  const classes = useStyles();

  return (
    <div className={classes.section}>
      <Typography variant="h3" className={classes.sectionTitle}>
        <b>{name}</b>
      </Typography>
      <Divider />
    </div>
  );
};

export default function Notes() {
  return (
    <div>
      <TaskSection name="Action Items" />
      <TaskSection name="Questions" />
      <TaskSection name="Take Aways" />
    </div>
  );
}
