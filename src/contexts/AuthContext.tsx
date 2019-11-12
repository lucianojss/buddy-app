import React from 'react';
import { AuthPayload } from 'types';

export interface State {
  loading: boolean;
  error: any;
  data: AuthPayload;
  isAuthenticated: boolean;
}

export interface AuthContextData extends State {
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

export const defaultState: State = {
  loading: false,
  error: null,
  data: {} as AuthPayload,
  isAuthenticated: false,
};

const defaultContext: AuthContextData = {
  ...defaultState,
  login: () => new Promise(() => null),
  logout: () => null,
};

const AuthContext = React.createContext<AuthContextData>(defaultContext);

export default AuthContext;