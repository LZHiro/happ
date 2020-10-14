import { Effect, Reducer, Subscription } from 'umi';
import { fetchWeiboIndex, fetchWeiboYaowen } from '@/services/api';


export interface HotItem {
  actionlog: {
    act_code: number;
    ext: string;
    fid: string;
    lfid: string;
    luicode: string;
    uicode: string;
  };
  card_type: number;
  desc: string;
  icon: string;
  itemid: string;
  pic: string;
  scheme: string;
  desc_extr?: number;
}

export interface YaowenItem {
  title_sub: string;
  scheme: string;
  pic: string;
  desc: string;
  card_type: string;
}

export interface WeiboStateType {
  hot: {
    minute: HotItem[];
    trending: HotItem[];
  };
  yaowen: YaowenItem[];
  local: [];

}
interface WeiboModelType {
  namespace: 'weibo';
  state: WeiboStateType;
  effects: {
    fetch: Effect;
    fetchYaowen:Effect;
    fetchBoth:Effect;
  };
  reducers: {
    save: Reducer<WeiboStateType>;
    saveBoth: Reducer<WeiboStateType>;
  },
}

const initialState: WeiboStateType = {
  hot: {
    minute: [],
    trending: []
  },
  yaowen: [],
  local: []
}

const Model: WeiboModelType = {
  namespace: 'weibo',
  state: initialState,
  effects: {
    *fetch({payload, callback}, {put, call}) {
      try {
        const result = yield call(fetchWeiboIndex, payload);
        if (result) {
          const { data: { cards } } = result;
          yield put({
            type: 'save',
            payload: {
              key: 'hot',
              data: {
                minute: cards[0].card_group,
                trending: cards[1].card_group,
              },
            }
          });
          callback && callback();
        }
      } catch (err) {
        callback && callback();
        console.error(err);
      }
    },
    *fetchYaowen({payload, callback}, {put, call}) {
      try {
        const result = yield call(fetchWeiboYaowen, payload);
        if (result) {
          const { data: { cards } } = result;
          yield put({
            type: 'save',
            payload: {
              key: 'yaowen',
              data: cards[0].card_group
            }
          });
          callback && callback();
        }
      } catch (err) {
        callback && callback();
        console.error(err);
      }
    },
    *fetchBoth({payload, callback}, {put, call}) {
      try {
        const result = yield [call(fetchWeiboIndex, payload), call(fetchWeiboYaowen, payload)];
        if (result) {
          const [ hotResult, yaowenResult ] = result;
          yield put({
            type: 'saveBoth',
            payload: [
              {
                data: {
                  minute: hotResult.data.cards[0].card_group,
                  trending: hotResult.data.cards[1].card_group,
                },
              },
              {
                data: yaowenResult.data.cards[0].card_group
              }
            ]
          });
          callback && callback();
        }
      } catch (err) {
        callback && callback();
        console.error(err);
      }
    }
  },
  reducers: {
    save(state = initialState,{ payload }) {
      return {
        ...state,
        [payload.key]: payload.data,
      }
    },
    saveBoth(state = initialState,{ payload }) {
      return {
        ...state,
        hot: payload[0].data,
        yaowen: payload[1].data
      }
    }
  }
}

export default Model;
