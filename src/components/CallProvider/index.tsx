import React, { createContext, useState, useMemo } from 'react';
import {
  LocalModel,
  Call,
  Template,
  Activity,
  ActivityDataTypes,
  ActivityData,
} from '~/firebase/schema-types';
import useCall from './useCall/useCall';
import useActivity from './useActivity/useActivity';
import useCurrentActivity from './useCurrentActivity/useCurrentActivity';

interface CallContextTypes {
  template: LocalModel<Template>;
  call?: LocalModel<Call>;
  isHost: boolean;
  createCall(): Promise<boolean>;
  endCall(): Promise<void>;
  currentActivity?: Activity;
  startActivity(activity: Activity): void;
  endActivity(): void;
  updateActivityData(activity: Activity, path: string | null, value: ActivityDataTypes): void;
  currentActivityData?: ActivityData;
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
  const useCurrentActivityProps = useCurrentActivity(template, useActivityProps.currentActivityId);

  const value = useMemo<CallContextTypes>(
    () => ({
      ...useCallProps,
      ...useActivityProps,
      ...useCurrentActivityProps,
      template,
      isHost,
      isActivityDrawerOpen,
      setIsActivityDrawerOpen,
    }),
    [
      useCallProps,
      useActivityProps,
      useCurrentActivityProps,
      template,
      isHost,
      isActivityDrawerOpen,
    ],
  );

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}
