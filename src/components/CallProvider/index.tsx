import React, { createContext } from 'react';
import { LocalModel, Call, Template, Activity, ActivityDataTypes } from '~/firebase/schema-types';

interface CallContextTypes {
  call?: LocalModel<Call>;
  template: LocalModel<Template>;
  isHost: boolean;
  endCall(): void;
  updateActivity(activity: Activity, path: string, value: ActivityDataTypes): void;
}

export const CallContext = createContext<CallContextTypes>(null!);

export function CallProvider({
  children,
  ...otherProps
}: React.PropsWithChildren<CallContextTypes>) {
  return <CallContext.Provider value={otherProps}>{children}</CallContext.Provider>;
}
