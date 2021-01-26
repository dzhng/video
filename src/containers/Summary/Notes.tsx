import React, { useCallback } from 'react';
import { get, entries } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Tooltip } from '@material-ui/core';
import {
  RadioButtonUncheckedOutlined as UncheckedIcon,
  RadioButtonCheckedOutlined as CheckedIcon,
  FileCopyOutlined as CopyIcon,
} from '@material-ui/icons';
import { useSnackbar } from 'notistack';

import { updateClipboard } from '~/utils';
import {
  CallData,
  TaskType,
  TaskSectionType,
  TasksDataKey,
  ActionItemsKey,
  QuestionsKey,
  TakeAwaysKey,
} from '~/firebase/rtdb-types';

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
    title: {
      display: 'flex',
      alignItems: 'center',

      '& h2': {
        flexGrow: 1,
      },
      '& button': {
        padding: 6,
        minWidth: 40,
      },
    },
    copyIcon: {
      '& svg': {
        fontSize: '1.0rem',
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

export default function Notes({ data }: { data: CallData }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const actionItems = get(data, [TasksDataKey, ActionItemsKey]) as TaskSectionType;
  const questions = get(data, [TasksDataKey, QuestionsKey]) as TaskSectionType;
  const takeAways = get(data, [TasksDataKey, TakeAwaysKey]) as TaskSectionType;

  const handleCopyNotes = useCallback(() => {
    const text = [actionItems, questions, takeAways]
      .map((tasks, idx) => {
        const tasksEntries = entries(tasks).sort((a, b) => a[1].order - b[1].order);
        const title = ['Action Items', 'Questions', 'Take Aways'][idx];

        return [
          title,
          '\n',
          ...tasksEntries.map(([_, task]) => `${task.isDone ? '[x]' : '[ ]'} ${task.name}\n`),
          '\n',
        ].join('');
      })
      .join('');

    updateClipboard(text);
    enqueueSnackbar('Notes copied to clipboard!');
  }, [actionItems, questions, takeAways, enqueueSnackbar]);

  return (
    <>
      <div className={classes.title}>
        <Typography variant="h2">Notes</Typography>
        <Tooltip title="Copy notes to clipboard" placement="top">
          <Button
            size="small"
            variant="outlined"
            color="primary"
            className={classes.copyIcon}
            onClick={handleCopyNotes}
          >
            <CopyIcon />
          </Button>
        </Tooltip>
      </div>
      <div className={classes.container}>
        <Section name="Action Items" tasks={actionItems} />
        <Section name="Questions" tasks={questions} />
        <Section name="Take Aways" tasks={takeAways} />
      </div>
    </>
  );
}
