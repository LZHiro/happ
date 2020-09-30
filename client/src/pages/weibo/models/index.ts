import { Effect, Reducer } from 'umi';
import { fetchWeiboIndex } from '@/services/api';


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

export interface WeiboStateType {
  hot: {
    minute: HotItem[];
    trending: HotItem[];
  };
  yaowen: [];
  local: [];

}
interface WeiboModelType {
  namespace: 'weibo';
  state: WeiboStateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<WeiboStateType>;
  }
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
        const result = yield call(fetchWeiboIndex);
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
    }
  },
  reducers: {
    save(state = initialState,{ payload }) {
      return {
        ...state,
        [payload.key]: payload.data,
      }
    }
  },
}

export default Model;
