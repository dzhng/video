import React, { createContext } from 'react';
import { LocalModel, Call, Template, Activity, ActivityDataTypes } from '~/firebase/schema-types';

interface CallContextTypes {
  call?: LocalModel<Call>;
  template: LocalModel<Template>;
  isHost: boolean;
  endCall(): void;
  currentActivity?: Activity;
  updateActivity(activity: Activity, path: string | null, value: ActivityDataTypes | object): void;
  endActivity(): void;
}

export const CallContext = createContext<CallContextTypes>(null!);

export function CallProvider({
  children,
  ...otherProps
}: React.PropsWithChildren<CallContextTypes>) {
  return <CallContext.Provider value={otherProps}>{children}</CallContext.Provider>;
}
