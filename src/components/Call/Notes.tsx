import React, { useCallback, useMemo } from 'react';
import { get } from 'lodash';
import { styled } from '@material-ui/core/styles';
import { useAppState } from '~/state';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import { TaskType, TaskSectionType } from './types';
import TaskSection from './TaskSection';

const TasksDataKey = 'tasks';
const ActionItemsKey = 'actionItems';
const QuestionsKey = 'questions';
const TakeAwaysKey = 'takeAways';

const Container = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(1),
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

  return <Container>{sections}</Container>;
}
