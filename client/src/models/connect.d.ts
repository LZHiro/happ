import { GlobalState } from './global';

export interface Loading {
  global: boolean;
  effects: {
    [key: string]: boolean | undefined;
  };
  models: {
    global?: boolean;
  }
}

export interface ConnectState {
  global: GlobalState
}

export { GlobalState };