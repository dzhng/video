import React, { useState, useCallback } from 'react';
import { values } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Divider, InputBase, IconButton } from '@material-ui/core';
import { AddOutlined as NewIcon } from '@material-ui/icons';
import { TaskSectionType } from './types';

const useStyles = makeStyles((theme) =>
  createStyles({
    section: {
      margin: theme.spacing(1),
    },
    sectionTitle: {
      marginTop: theme.spacing(1),
    },
    input: {
      minHeight: 30,
    },
  }),
);

const Task = ({
  name,
  updateTask,
  deleteTask,
}: {
  name: string;
  updateTask(name: string): void;
  deleteTask(): void;
}) => {
  const classes = useStyles();

  return (
    <div>
      <InputBase
        multiline
        margin="dense"
        rows={1}
        rowsMax={3}
        className={classes.input}
        value={name}
      />
    </div>
  );
};

export default function TaskSection({
  name,
  tasks,
  createTask,
  updateTask,
  deleteTask,
}: {
  name: string;
  tasks: TaskSectionType;
  createTask(name: string): void;
  updateTask(id: string, name: string): void;
  deleteTask(id: string): void;
}) {
  const classes = useStyles();
  const [input, setInput] = useState('');
  const tasksList = values(tasks).sort((a, b) => a.order - b.order);

  const handleCreate = useCallback(() => {
    if (input.length > 0) {
      createTask(input);
      setInput('');
    }
  }, [input, createTask]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        handleCreate();
      }
    },
    [handleCreate],
  );

  return (
    <div className={classes.section}>
      <Typography variant="h3" className={classes.sectionTitle}>
        <b>{name}</b>
      </Typography>

      {tasksList.map((task) => (
        <Task name={task.name} />
      ))}

      <InputBase
        fullWidth
        multiline
        margin="dense"
        rows={1}
        rowsMax={3}
        className={classes.input}
        value={input}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={`Create a new ${name.toLowerCase().replace(/s$/, '')}`}
        endAdornment={
          input.length > 0 && (
            <IconButton size="small" color="secondary" onClick={handleCreate}>
              <NewIcon />
            </IconButton>
          )
        }
      />
      <Divider />
    </div>
  );
}
