import React, { useState, useCallback, useRef } from 'react';
import clsx from 'clsx';
import { entries } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Divider, InputBase, IconButton } from '@material-ui/core';
import {
  AddOutlined as NewIcon,
  DeleteOutlined as DeleteIcon,
  RadioButtonUncheckedOutlined as UncheckedIcon,
  RadioButtonCheckedOutlined as CheckedIcon,
} from '@material-ui/icons';
import { useHotkeys } from 'react-hotkeys-hook';
import { TaskSectionType } from './types';

const MaxTaskLength = 280;

const useStyles = makeStyles((theme) =>
  createStyles({
    section: {
      margin: theme.spacing(1),
    },
    sectionTitle: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    input: {
      minHeight: 27,

      // if it's marked as done, decorate text
      '&.isDone': {
        color: theme.palette.grey[600],
      },

      // hide delete button until hover
      '&:hover': {
        '& .deleteButton': {
          visibility: 'visible',
        },
      },
      '& .deleteButton': {
        visibility: 'hidden',
      },

      '& textarea': {
        minHeight: 17,
        lineHeight: '17px',
      },
      '& button': {
        width: 23,
        height: 23,
        // so it can fit in same space as textarea's height
        // to prevent jumpy effect when button is shown
        marginBottom: '-3px',
        marginTop: '-3px',
      },
      '& svg': {
        width: '0.85em',
        height: '0.85em',
      },
    },
    checkButton: {
      marginRight: theme.spacing(1),
    },
  }),
);

const Task = ({
  name,
  isDone,
  updateTask,
  deleteTask,
}: {
  name: string;
  isDone: boolean;
  updateTask(name?: string, isDone?: boolean): void;
  deleteTask(): void;
}) => {
  const classes = useStyles();

  return (
    <InputBase
      fullWidth
      multiline
      margin="dense"
      rows={1}
      rowsMax={3}
      className={clsx(classes.input, { isDone })}
      value={name}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateTask(e.target.value)}
      startAdornment={
        <IconButton
          size="small"
          color="secondary"
          className={classes.checkButton}
          onClick={() => updateTask(undefined, !isDone)}
        >
          {isDone ? <CheckedIcon /> : <UncheckedIcon />}
        </IconButton>
      }
      endAdornment={
        <IconButton size="small" onClick={deleteTask} className="deleteButton">
          <DeleteIcon />
        </IconButton>
      }
    />
  );
};

export default function TaskSection({
  title,
  hotkey,
  tasks,
  createTask,
  updateTask,
  deleteTask,
}: {
  title: string;
  hotkey: string;
  tasks: TaskSectionType;
  createTask(name: string): void;
  updateTask(id: string, name?: string, isDone?: boolean): void;
  deleteTask(id: string): void;
}) {
  const classes = useStyles();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const tasksEntries = entries(tasks).sort((a, b) => a[1].order - b[1].order);

  const handleCreate = useCallback(() => {
    if (input.length > 0) {
      createTask(input);
      setInput('');
    }
  }, [input, createTask]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length < MaxTaskLength) {
      setInput(e.target.value);
    }
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCreate();
      }
    },
    [handleCreate],
  );

  useHotkeys(
    hotkey,
    (e) => {
      e.preventDefault();
      inputRef.current?.focus();
    },
    // use keyup event since keypress is taken by nav
    // this way the same hotkey can be binded to multiple
    // handlers
    { keyup: true },
  );

  // cancel focus when esc is pressed
  useHotkeys(
    'esc,tab',
    (e) => {
      if (window.document.activeElement === inputRef.current) {
        e.preventDefault();
        inputRef.current?.blur();
      }
    },
    {
      enableOnTags: ['TEXTAREA'],
    },
  );

  return (
    <div className={classes.section}>
      <Typography variant="h3" className={classes.sectionTitle}>
        <b>{title}</b>
      </Typography>

      {tasksEntries.map(([id, task]) => (
        <Task
          key={id}
          name={task.name}
          isDone={task.isDone}
          updateTask={(name, isDone) => updateTask(id, name, isDone)}
          deleteTask={() => deleteTask(id)}
        />
      ))}

      <InputBase
        inputRef={inputRef}
        fullWidth
        multiline
        margin="dense"
        rows={1}
        rowsMax={3}
        className={classes.input}
        value={input}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={`Create a new ${title.toLowerCase().replace(/s$/, '')}`}
        startAdornment={
          <IconButton
            size="small"
            color="secondary"
            disabled={input.length === 0}
            className={classes.checkButton}
            onClick={handleCreate}
          >
            <NewIcon />
          </IconButton>
        }
      />
      <Divider />
    </div>
  );
}
