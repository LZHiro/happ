import { ReactNode } from 'react';


const routes =  [
  { exact: true, path: '/', redirect: '/basic/weibo' },
  { exact: true, path: '/basic', redirect: '/basic/weibo' },
  { exact: false, path: '/basic', component: '@/layout/basicLayout',
  routes: [
    { exact: true, path: '/basic/trending', component: '@/pages/trending/index', icon: '#icongit', title: 'Trending'},
    { exact: true, path: '/basic/weibo', component: '@/pages/weibo/index', icon: '#iconsina', title: 'Weibo'},
    { exact: true, path: '/basic/stack', component: '@/pages/stack/index', icon: '#iconStackingdiagram', title: 'Stack'},
    { exact: true, path: '/basic/music', component: '@/pages/music/index', icon: '#iconmusic', title: 'Music'},
    { exact: true, path: '/basic/setting', component: '@/pages/setting/index', icon: '#iconset-color', title: 'Setting'},
  ]},
  {exact: true, path: '/weibo/:id', component: '@/pages/weibo/detail'}
]

export interface RouteItem {
  authority?: string[] | string;
  children?: RouteItem[];
  redirect?:string;
  exact?:boolean;
  icon?: string;
  name?: string;
  title?: string;
  Routes?:string[];
  key?: string;
  path?: string;
  component?:string | ReactNode;
  [key: string]: any;
}

export type Route = RouteItem[]

export default routes;