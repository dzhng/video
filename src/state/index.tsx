import React, { createContext, useContext, useReducer, useState } from 'react';
import firebase from 'firebase';

import { RoomType } from '~/utils/twilio-types';
import { User, Workspace, LocalModel } from '~/firebase/schema-types';

import {
  settingsReducer,
  initialSettings,
  Settings,
  SettingsAction,
} from './settings/settingsReducer';
import useFirebaseAuth from './useFirebaseAuth/useFirebaseAuth';
import useWorkspaces from './useWorkspaces/useWorkspaces';
import usePendingWrite from './usePendingWrite/usePendingWrite';

export interface StateContextType {
  error: Error | string | null;
  setError(error: Error | string | null): void;

  // auth
  getToken(room: string): Promise<string>;
  user?: firebase.User | null;
  signIn(): Promise<firebase.User | null>;
  signInAnonymously(): Promise<firebase.User | null>;
  signOut(): Promise<void>;
  isAuthReady?: boolean;
  isFetching: boolean;
  register(): Promise<firebase.User | null>;

  // workspaces
  currentWorkspaceId?: string | null;
  setCurrentWorkspaceId(workspaceId: string | null): void;
  userRecord?: User | null;
  workspaces?: LocalModel<Workspace>[];
  isWorkspacesReady: boolean;
  createWorkspace(name: string): Promise<LocalModel<Workspace>>;

  // ux state
  isWriting: boolean;
  markIsWriting(): void;

  // video settings
  settings: Settings;
  dispatchSetting: React.Dispatch<SettingsAction>;
  roomType?: RoomType;
}

export const StateContext = createContext<StateContextType>(null!);

export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<Error | string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [settings, dispatchSetting] = useReducer(settingsReducer, initialSettings);

  let contextValue = {
    error,
    setError,
    isFetching,
    settings,
    dispatchSetting,
  } as StateContextType;

  contextValue = {
    ...contextValue,
    ...useFirebaseAuth(),
    ...useWorkspaces(),
    ...usePendingWrite(),
  };

  const getToken: StateContextType['getToken'] = async (room) => {
    setIsFetching(true);
    try {
      const res = await contextValue.getToken(room);
      setIsFetching(false);
      return res;
    } catch (err) {
      setError(err);
      setIsFetching(false);
      return Promise.reject(err);
    }
  };

  return (
    <StateContext.Provider value={{ ...contextValue, getToken }}>
      {props.children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
