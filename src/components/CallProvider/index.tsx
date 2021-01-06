import React, { createContext, useMemo } from 'react';
import {
  LocalModel,
  Call,
  Template,
  Activity,
  ActivityDataTypes,
  ActivityCallData,
} from '~/firebase/schema-types';

interface CallContextTypes {
  call?: LocalModel<Call>;
  template: LocalModel<Template>;
  isHost: boolean;
  endCall(): void;
  currentActivity?: Activity;
  updateActivity(activity: Activity, path: string | null, value: ActivityDataTypes): void;
  endActivity(): void;
  currentCallData?: ActivityCallData;
}

export const CallContext = createContext<CallContextTypes>(null!);

export function CallProvider({
  children,
  ...otherProps
}: React.PropsWithChildren<CallContextTypes>) {
  const { call, currentActivity } = otherProps;

  const currentCallData = useMemo<ActivityCallData | undefined>(() => {
    if (call && currentActivity) {
      return (call.activityData ? call.activityData[currentActivity.id] : {}) as ActivityCallData;
    }
  }, [call, currentActivity]);

  const value = useMemo(
    () => ({
      ...otherProps,
      currentCallData,
    }),
    [currentCallData, otherProps],
  );

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}
