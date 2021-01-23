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
        marginBottom: theme.spacing(1),
        fontWeight: 'bold',
      },
    },
  }),
);

const Task = ({ task }: { task: TaskType }) => {
  return (
    <div>
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
      {tasksEntries.map(([id, task]) => (
        <Task key={id} task={task} />
      ))}
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
