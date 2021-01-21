import React, { createContext, useState, useMemo } from 'react';
import {
  LocalModel,
  Call,
  Template,
  Activity,
  CallDataTypes,
  CallData,
} from '~/firebase/schema-types';
import useCall from './useCall/useCall';
import useActivity from './useActivity/useActivity';
import useCallData from './useCallData/useCallData';
import useCurrentActivity from './useCurrentActivity/useCurrentActivity';

interface CallContextTypes {
  template: LocalModel<Template>;
  call?: LocalModel<Call>;
  isHost: boolean;
  createCall(): Promise<boolean>;
  endCall(): Promise<void>;

  // activity data management
  currentActivity?: Activity;
  startActivity(activity: Activity): void;
  endActivity(): void;
  updateActivityData(activity: Activity, path: string | null, value: CallDataTypes): void;
  currentActivityData?: CallData;

  // call data management
  currentCallData?: CallData;
  updateCallData(key: string, path: string | null, value: CallDataTypes): void;

  // ui states
  isActivityDrawerOpen: boolean;
  setIsActivityDrawerOpen(open: boolean): void;
}

interface PropTypes {
  template: LocalModel<Template>;
  isHost: boolean;
}

export const CallContext = createContext<CallContextTypes>(null!);

export function CallProvider({ children, template, isHost }: React.PropsWithChildren<PropTypes>) {
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);

  const useCallProps = useCall(template);
  const useActivityProps = useActivity(useCallProps.call);
  const useCallDataProps = useCallData(useCallProps.call);
  const useCurrentActivityProps = useCurrentActivity(template, useActivityProps.currentActivityId);

  const value = useMemo<CallContextTypes>(
    () => ({
      ...useCallProps,
      ...useActivityProps,
      ...useCallDataProps,
      ...useCurrentActivityProps,
      template,
      isHost,
      isActivityDrawerOpen,
      setIsActivityDrawerOpen,
    }),
    [
      useCallProps,
      useActivityProps,
      useCallDataProps,
      useCurrentActivityProps,
      template,
      isHost,
      isActivityDrawerOpen,
    ],
  );

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}
