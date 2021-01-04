import React from 'react';
import { ActivityTypeConfig } from '../Types/Types';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import ErrorDisplay from './Error';

export default function ActivityDisplay() {
  const { call, template } = useCallContext();

  if (!call || !call.currentActivityId) {
    return <ErrorDisplay />;
  }

  const activity = template.activities.find((act) => act.id === call.currentActivityId);
  if (!activity) {
    return <ErrorDisplay />;
  }

  const config = ActivityTypeConfig.find((_config) => _config.type === activity.type);
  if (!config) {
    return <ErrorDisplay />;
  }

  return config.display;
}
