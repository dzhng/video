import React from 'react';
import { get, entries } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import {
  RadioButtonUncheckedOutlined as UncheckedIcon,
  RadioButtonCheckedOutlined as CheckedIcon,
} from '@material-ui/icons';

import { TasksDataKey, ActionItemsKey, QuestionsKey, TakeAwaysKey } from '~/constants';
import { TaskType, TaskSectionType } from '~/components/Call/types';
import { CallData } from '~/firebase/schema-types';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      '& h5': {
        marginTop: theme.spacing(1),
        fontWeight: 'bold',
      },
    },
    task: {
      display: 'flex',
      alignItems: 'center',
      marginTop: 3,
      marginBottom: 3,

      '& p': {
        flexGrow: 1,
      },
      '& svg': {
        width: '0.85em',
        height: '0.85em',
        marginRight: theme.spacing(1),
        color: theme.palette.secondary.main,
      },
    },
  }),
);

const Task = ({ task }: { task: TaskType }) => {
  const classes = useStyles();
  return (
    <div className={classes.task}>
      {task.isDone ? <CheckedIcon /> : <UncheckedIcon />}
      <Typography variant="body1">{task.name}</Typography>
    </div>
  );
};

const Section = ({ name, tasks }: { name: string; tasks: TaskSectionType }) => {
  const tasksEntries = entries(tasks).sort((a, b) => a[1].order - b[1].order);

  return (
    <div>
      <Typography variant="h5">{name}</Typography>
      {tasksEntries.length > 0 ? (
        tasksEntries.map(([id, task]) => <Task key={id} task={task} />)
      ) : (
        <Typography variant="body1" style={{ marginTop: 3, marginBottom: 3, color: '#888' }}>
          No {name.toLowerCase()} were created during this call.
        </Typography>
      )}
    </div>
  );
};

export default function Notes({ data }: { data: { [key: string]: CallData } }) {
  const classes = useStyles();

  const actionItems = get(data, [TasksDataKey, ActionItemsKey]) as TaskSectionType;
  const questions = get(data, [TasksDataKey, QuestionsKey]) as TaskSectionType;
  const takeAways = get(data, [TasksDataKey, TakeAwaysKey]) as TaskSectionType;

  return (
    <div className={classes.container}>
      <Section name="Action Items" tasks={actionItems} />
      <Section name="Questions" tasks={questions} />
      <Section name="Take Aways" tasks={takeAways} />
    </div>
  );
}
