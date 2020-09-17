import request from '@/utils/request';


export interface TrendingParams {
  date: 'today' | 'week' | 'month';
  language?: string
}
export function fetchTrending(params: TrendingParams) {
  return request('//hiro.cn:8443/trending');  
}

export interface LanguageParams {
  since: string;
  language: string;
}
export function fetchLanguageTrending(params: LanguageParams) {
  return request(`//hiro.cn:8443/trending/${encodeURIComponent(params.language)}`, {
    params: {
      since: params.since,
    }
  });
}