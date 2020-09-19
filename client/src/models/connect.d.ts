import { GlobalState } from './global';
import { TrendingStateType } from '@/pages/trending/models/index';
import { WeiboStateType } from '@/pages/weibo/models/index';

export interface Loading {
  global: boolean;
  effects: {
    [key: string]: boolean | undefined;
  };
  models: {
    global?: boolean;
    trending?: boolean;
    weibo?: boolean;
  }
}

export interface ConnectState {
  global: GlobalState;
  trending: TrendingStateType;
  loading: Loading;
  weibo: WeiboStateType;
}

export { GlobalState };