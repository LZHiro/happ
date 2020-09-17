import { GlobalState } from './global';
import { TrendingStateType } from '@/pages/trending/models/index';

export interface Loading {
  global: boolean;
  effects: {
    [key: string]: boolean | undefined;
  };
  models: {
    global?: boolean;
    trending?: boolean;
  }
}

export interface ConnectState {
  global: GlobalState;
  trending: TrendingStateType;
  loading: Loading
}

export { GlobalState };