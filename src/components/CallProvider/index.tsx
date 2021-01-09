import React, { createContext, useMemo } from 'react';
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
}

interface PropTypes {
  template: LocalModel<Template>;
  isHost: boolean;
}

export const CallContext = createContext<CallContextTypes>(null!);

export function CallProvider({ children, template, isHost }: React.PropsWithChildren<PropTypes>) {
  const useCallProps = useCall(template);
  const useActivityProps = useActivity(template, useCallProps.call);

  const value = useMemo<CallContextTypes>(
    () => ({
      ...useCallProps,
      ...useActivityProps,
      template,
      isHost,
    }),
    [useCallProps, useActivityProps, template, isHost],
  );

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}
