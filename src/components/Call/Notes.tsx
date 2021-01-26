import React, { useCallback, useMemo } from 'react';
import { get } from 'lodash';
import { styled } from '@material-ui/core/styles';
import { useAppState } from '~/state';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import {
  TaskType,
  TaskSectionType,
  TasksDataKey,
  ActionItemsKey,
  QuestionsKey,
  TakeAwaysKey,
} from '~/firebase/rtdb-types';
import TaskSection from './TaskSection';

const Container = styled('div')(({ theme }) => ({
  ...theme.customMixins.scrollBar,
  marginTop: theme.spacing(1),
  overflowY: 'auto',
}));

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
    (type: string, id: string, name?: string, isDone?: boolean) => {
      if (name !== undefined) {
        updateCallData(TasksDataKey, `${type}.${id}.name`, name);
      }
      if (isDone !== undefined) {
        updateCallData(TasksDataKey, `${type}.${id}.isDone`, isDone);
      }
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
    [ActionItemsKey, 'Action Items', 'i'],
    [QuestionsKey, 'Questions', 'q'],
    [TakeAwaysKey, 'Take Aways', 't'],
  ].map(([key, title, hotkey]) => {
    // disabling rules of hooks because even though it's called in a callback,
    // it's done in map of static var which means it's a guarenteed ordered synchronous call
    // eslint-disable-next-line react-hooks/rules-of-hooks,react-hooks/exhaustive-deps
    const createCallback = useMemo(() => (name: string) => createTask(key, name), [createTask]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const updateCallback = useMemo(
      () => (id: string, name?: string, isDone?: boolean) => updateTask(key, id, name, isDone),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [updateTask],
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks,react-hooks/exhaustive-deps
    const deleteCallback = useMemo(() => (id: string) => deleteTask(key, id), [deleteTask]);
    const tasks = get(currentCallData, [TasksDataKey, key], {}) as TaskSectionType;

    return (
      <TaskSection
        key={key}
        title={title}
        hotkey={hotkey}
        tasks={tasks}
        createTask={createCallback}
        updateTask={updateCallback}
        deleteTask={deleteCallback}
      />
    );
  });

  return <Container>{sections}</Container>;
}
