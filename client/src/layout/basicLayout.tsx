import React, { Props, useState, useLayoutEffect, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styles from './basicLayout.less';
import { TabBar, Carousel, Icon} from 'antd-mobile';
import { Route, RouteItem } from '../../config/router.config';
import { history, connect, Dispatch } from 'umi';
import { ConnectState, GlobalState } from '@/models/connect';

interface BasicRoute extends Route,RouteItem {
  routes: Route
}
interface BasicLayoutProps extends GlobalState,RouteComponentProps,Props<any>{
  route: BasicRoute;
  dispatch: Dispatch;
}

const mapStateToProps = ({ global }: ConnectState) => ({
  pagesCache: global.pagesCache,
});


function BasicLayout(props: BasicLayoutProps) {

  const { route: { routes }, location, dispatch, pagesCache } = props;
  const [ currentIndex, setCurrentIndex ] = useState<number>(getIndex(location.pathname));

  useLayoutEffect(() => {
    initPages();
  }, []);

  useEffect(() => {
    const index = getIndex(location.pathname);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
    if (pagesCache.length) {
      const pages = routes.map((route,i) => {
        if (route.path === location.pathname) {
          const Component = route.component as any;
          return <Component key={route.path} />;
        } else {
          return pagesCache[i];
        }
      });
      dispatch({
        type:'global/setPagesCache',
        payload: {
          pagesCache: pages
        }
      });
    } 

  }, [ location.pathname ]);


  function getIndex(path?:string) {
    return routes.findIndex(d => d.path === path);
  }

  function initPages() {
    const pages = routes.map(route => {
      if (route.path === location.pathname) {
        const Component = route.component as any;
        return <Component key={route.path} />;
      } else {
        return (
          <div key={route.path}></div>
        );
      }
    });
    dispatch({
      type: 'global/setPagesCache',
      payload: {
        pagesCache: pages
      }
    });
  }

  function toPage(path:string) {
    return () => {
      if (location.pathname !== path) {
        history.push(path);
      }
    }
  }

  function MyTabBar() {
    if (routes.length) {
      const tabBarItems = routes.map((d,i) => {
        return (
          <TabBar.Item
            title={d.title}
            key={d.path}
            icon={(
              <svg className={`${styles.tabIcon} ${styles.unSelect}`}aria-hidden="true">
                  <use xlinkHref={d.icon}></use>
              </svg>
            )}
            selectedIcon={(
              <svg className={styles.tabIcon} aria-hidden="true">
                  <use xlinkHref={d.icon}></use>
              </svg>
            )}
            selected={location.pathname === d.path}
            onPress={toPage(d.path as string)}
          >
          </TabBar.Item>
        )
      });
      return (
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          tabBarPosition="bottom"
        >
          {tabBarItems}
        </TabBar>
      )
    }
    return null;
  }

  function pageChange(index:number) {
    if (index !== currentIndex && routes[index].path !== location.pathname) {
      history.push(routes[index].path);
    }
    setCurrentIndex(index);
  }
  return (
    <div className={styles.basicLayout}>
      <Carousel
        autoplay={false}
        dots={false}
        infinite={false}
        swipeSpeed={4}
        selectedIndex={currentIndex}
        afterChange={pageChange}
      >
        { pagesCache }
      </Carousel>
      <MyTabBar />
    </div>
  )
}


export default connect(mapStateToProps)(BasicLayout);