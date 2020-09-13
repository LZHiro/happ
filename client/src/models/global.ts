import { Effect, Subscription, Reducer } from 'umi';
import { ReactNode } from 'react';

export interface GlobalState {
  pagesCache: ReactNode[]
}
interface GloablModel {
  namespace: 'global',
  state: GlobalState,
  effects: {},
  reducers: {
    setPagesCache: Reducer<GlobalState>
  },
  subscriptions: {
    setup: Subscription
  }
}

const initialState:GlobalState = {
  pagesCache: []
}

const global:GloablModel = {
  namespace: 'global',
  state: initialState,
  effects: {},
  reducers: {
    setPagesCache(state = initialState, { payload }) {
      return {
        ...state,
        pagesCache: payload.pagesCache
      }
    }
  },
  subscriptions: {
    setup({history}):void {
      
    }
  }
}

export default global;