import request from '@/utils/request';
import apiRoot from '../../config/api';


export interface TrendingParams {
  date: 'today' | 'week' | 'month';
  language?: string
}
export function fetchTrending() {
  return request(apiRoot + '/trending');  
}

export interface LanguageParams {
  since: string;
  language: string;
}
export function fetchLanguageTrending(params: LanguageParams) {
  return request(apiRoot + `/trending/${encodeURIComponent(params.language)}`, {
    params: {
      since: params.since,
    }
  });
}

export interface FetchWeiboParams {
  noLoading?: boolean;
}
export function fetchWeiboIndex(params: FetchWeiboParams) {
  return request(apiRoot + '/weibo/index', params);
}

export function fetchWeiboYaowen(params: FetchWeiboParams) {
  return request(apiRoot + '/weibo/yaowen', params);
}

