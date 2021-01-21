import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Divider } from '@material-ui/core';

interface TaskType {
  uid: string;
  isDone: boolean;
  name: string;
  createdAt: number; // since rtdb doesn't store dates, store ms timestamp
}

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

const TaskSection = ({ name, tasks }: { name: string; tasks: string[] }) => {
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
      <TaskSection name="Action Items" tasks={[]} />
      <TaskSection name="Questions" tasks={[]} />
      <TaskSection name="Take Aways" tasks={[]} />
    </div>
  );
}
