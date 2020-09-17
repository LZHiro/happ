import { Effect, Reducer, Subscription } from 'umi';
import { fetchTrending, fetchLanguageTrending } from '@/services/api';

export interface TrendingModelType {
  namespace: 'trending';
  state: TrendingStateType;
  effects: {
    fetch: Effect;
    fetchLanguage: Effect;
  };
  reducers: {
    save: Reducer<TrendingStateType>;
    saveLanguage: Reducer<TrendingStateType>;
  };
  subscriptions: {
    setup: Subscription
  }
}

export interface ListItem {
  link: string;
  language: string;
  author: string;
  project: string;
  stars: number;
  branch: number;
  description: string;
  star_today: number;
}

export interface TrendingItem {
  today: ListItem[];
  week: ListItem[];
  month: ListItem[];
}

export interface TrendingStateType {
  data: {
    Any:TrendingItem;
    [key: string]: TrendingItem;
  }
}

const initialState: TrendingStateType = {
  data: {
    Any: {
      today: [],
      week: [],
      month: [],
    }
  },
}

const Model: TrendingModelType = {
  namespace: 'trending',
  state: initialState,
  effects: {
    *fetch({payload, callback}, { call, put }) {
      const result = yield call(fetchTrending, payload);
      if(result) {
        yield put({
          type: 'save',
          payload: result.data
        });
        callback && callback();
      }
    },
    *fetchLanguage({ payload, callback }, { call, put }) {
      const result = yield call(fetchLanguageTrending, payload);
      if(result) {
        yield put({
          type: 'saveLanguage',
          payload: {
            language: payload.language,
            data: result.data,
          },
        });
        callback && callback();
      }
    }
  },
  reducers: {
    save(state = initialState, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          Any: payload
        }
      }
    },
    saveLanguage(state = initialState, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          [payload.language]: payload.data
        }
      }
    }
  },
  subscriptions: {
    setup({ history, dispatch }):void {
      const { location } = history;
      // if (location.pathname === '/basic/trending') {
      //   dispatch({
      //     type: 'fetch',
      //     payload: {
      //       date: 'today'
      //     }
      //   });
      // }
    }
  }
}



export default Model;
