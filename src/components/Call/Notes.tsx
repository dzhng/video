import React, { useState, useCallback, useMemo } from 'react';
import { get, values } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Divider, InputBase, IconButton } from '@material-ui/core';
import { AddOutlined as NewIcon } from '@material-ui/icons';
import { useAppState } from '~/state';
import useCallContext from '~/hooks/useCallContext/useCallContext';

const TasksDataKey = 'tasks';
const ActionItemsKey = 'actionItems';
const QuestionsKey = 'questions';
const TakeAwaysKey = 'takeAways';

interface TaskType {
  uid: string;
  isDone: boolean;
  name: string;
  order: number; // integer used for sorting
}

interface TaskSectionType {
  [id: string]: TaskType;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    section: {
      margin: theme.spacing(1),
    },
    sectionTitle: {
      marginTop: theme.spacing(1),
    },
  }),
);

const TaskSection = ({
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
}) => {
  const classes = useStyles();
  const [input, setInput] = useState('');
  const tasksList = values(tasks).sort((a, b) => a.order - b.order);

  const handleCreate = useCallback(() => {
    if (input.length > 0) {
      createTask(input);
      setInput('');
    }
  }, [input, createTask]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
        <div>{task.name}</div>
      ))}

      <InputBase
        fullWidth
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
};

export default function Notes() {
  const { user } = useAppState();
  const { currentCallData, updateCallData } = useCallContext();

  const createTask = useCallback(
    (type: string, name: string) => {
      if (!user) {
        return;
      }

      const nowMs = new Date().getTime();
      const taskData: TaskType = {
        uid: user.uid,
        isDone: false,
        name,
        order: nowMs,
      };
      // should generate a relatively unique key
      const key = `${user.uid}-${nowMs}`;

      updateCallData(TasksDataKey, `${type}.${key}`, taskData);
    },
    [user, updateCallData],
  );

  const updateTask = useCallback(
    (type: string, id: string, name: string) => {
      updateCallData(TasksDataKey, `${type}.${id}.name`, name);
    },
    [updateCallData],
  );

  const deleteTask = useCallback(
    (type: string, id: string) => {
      // setting to null is the same as deleting it in rtdb
      updateCallData(TasksDataKey, `${type}.${id}`, null);
    },
    [updateCallData],
  );

  const sections = [
    [ActionItemsKey, 'Action Items'],
    [QuestionsKey, 'Questions'],
    [TakeAwaysKey, 'Take Aways'],
  ].map(([key, title]) => {
    // disabling rules of hooks because even though it's called in a callback,
    // it's done in map of static var which means it's a guarenteed ordered synchronous call
    // eslint-disable-next-line react-hooks/rules-of-hooks,react-hooks/exhaustive-deps
    const createCallback = useMemo(() => (name: string) => createTask(key, name), [createTask]);
    // eslint-disable-next-line react-hooks/rules-of-hooks,react-hooks/exhaustive-deps
    const updateCallback = useMemo(() => (id: string, name: string) => updateTask(key, id, name), [
      updateTask,
    ]);
    // eslint-disable-next-line react-hooks/rules-of-hooks,react-hooks/exhaustive-deps
    const deleteCallback = useMemo(() => (id: string) => deleteTask(key, id), [deleteTask]);
    const tasks = get(currentCallData, [TasksDataKey, key], {}) as TaskSectionType;

    return (
      <TaskSection
        key={key}
        name={title}
        tasks={tasks}
        createTask={createCallback}
        updateTask={updateCallback}
        deleteTask={deleteCallback}
      />
    );
  });

  return <div>{sections}</div>;
}
