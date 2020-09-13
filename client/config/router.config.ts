import { ReactNode } from 'react';


const routes =  [
  { exact: true, path: '/', redirect: '/basic/trending' },
  { exact: true, path: '/basic', redirect: '/basic/trending' },
  { exact: false, path: '/basic', component: '@/layout/basicLayout',
  routes: [
    { exact: true, path: '/basic/trending', component: '@/pages/trending/index', icon: '#icongit', title: 'Trending'},
    { exact: true, path: '/basic/music', component: '@/pages/music/index', icon: '#iconmusic', title: 'Music'},
    { exact: true, path: '/basic/sina', component: '@/pages/sina/index', icon: '#iconsina', title: 'Sina'},
    { exact: true, path: '/basic/stack', component: '@/pages/stack/index', icon: '#iconStackingdiagram', title: 'Stack'},
    { exact: true, path: '/basic/setting', component: '@/pages/setting/index', icon: '#iconset-color', title: 'Setting'},
  ]},
  {exact: true, path: '/sina/:id', component: '@/pages/sina/detail'}
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