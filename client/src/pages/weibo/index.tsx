import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import styles from './index.less';
import { Tabs, Modal } from 'antd-mobile';
import { connect, Dispatch, WeiboStateType, HotItem } from 'umi';
import { ConnectState } from '@/models/connect';
import useInViewport from '@/hooks/useInViewport';
import QueueAnim from 'rc-queue-anim';
import { TabBarPropsType } from 'rmc-tabs/lib';
import classnames from 'classnames';
import useScroll from '@/hooks/useScroll';

interface WeiboProps extends WeiboStateType {
  dispatch: Dispatch;
}

const mapStateToProps = ({ weibo: { hot, yaowen }, loading }: ConnectState) => ({
  loading: loading.effects['weibo/fetch'],
  hot,
  yaowen
});

const tabs = [{
  title: '热搜榜',
  index: 'hot',
}, {
  title: '要闻榜',
  index: 'yaowen',
}, {
  title: '同城榜',
  index: 'local',
}];

let hotTimer: NodeJS.Timeout;
let yaowenTimer: NodeJS.Timeout;
let bothTimer: NodeJS.Timeout;

const Weibo:React.FC<WeiboProps> = (props) => {
  const observeRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [ refreshing, setRefreshing ] = useState(false);
  const [ activeTab, setActiveTab ] = useState(0);
  const [ lastScrollTop, setLastScrollTop ] = useState(0);
  
  useEffect(() => {
    props.dispatch({
      type: 'weibo/fetch',
      callback() {
        if (yaowenTimer && !bothTimer) {
          return registTimer('both');
        }
        if (!hotTimer && !bothTimer) {
          registTimer('hot');
        }
      }
    });
    return () => {
      unregistTimer('all');
    }
  }, []);


  const inviewport = useInViewport(observeRef);
  const headerInviewport = useInViewport(headerRef);
  const scroll = useScroll(containerRef);

  useEffect(() => {
    setLastScrollTop(scroll.top);
  }, [ inviewport ]);


  function handleItemClick(scheme: string) {
    if (scheme) {
      Modal.alert('This action will jump to Weibo.', 'Are you sure?', [
        { text: 'Cancel', style: 'default', onPress() {} },
        { text: 'Got it', onPress(){location.assign(scheme)} },
      ]);
    }
  }
  
  function registTimer(name: string) {
    switch(name) {
      case 'hot':
        console.log('start hot timer');
        hotTimer = setInterval(() => {
          props.dispatch({
            type: 'weibo/fetch',
            payload: {
              noLoading: true,
            }
          });
        }, 60000);
        break;
      case 'yaowen':
        console.log('start hot timer');
        yaowenTimer = setInterval(() => {
          props.dispatch({
            type: 'weibo/fetchYaoen',
            payload: {
              noLoading: true,
            }
          });
        }, 60000);
        break;
      case 'both':
        console.log('start both timer');
        clearInterval(hotTimer);
        clearInterval(yaowenTimer);
        bothTimer = setInterval(() => {
          props.dispatch({
            type: 'weibo/fetchBoth',
            payload: {
              noLoading: true,
            }
          });
        }, 60000)
        break;
      default:
        return;
    }
  }
  function unregistTimer(name: string) {
    switch(name) {
      case 'hot':
        clearInterval(hotTimer);
        break;
      case 'yaowen':
        clearInterval(yaowenTimer);
        break;
      case 'both':
        clearInterval(bothTimer);
        break;
      default:
        clearInterval(hotTimer);
        clearInterval(yaowenTimer);
        clearInterval(bothTimer)
    }
  }
  function renderTabBar(props: TabBarPropsType) {
    const className = classnames({
      [`${styles.tabbar}`]: true,
      [`${styles.fixed}`]: !inviewport,
    });

    return (
      <>
        <div style={{display: !inviewport ? 'block': 'none'}} className={styles.placeholder}></div>
        <div style={!inviewport && headerRef.current && headerInviewport ? {
          top: `${headerRef.current.getBoundingClientRect().top + headerRef.current.clientHeight}px`,
          position: 'fixed',
        } : {
          position: !headerInviewport ? 'fixed': 'relative'
        }} className={className}>
          <Tabs.DefaultTabBar {...props} />
        </div>
      </>
    )
  }

  function handleRefresh() {
    if (!refreshing) {
      setRefreshing(true);
      props.dispatch({
        type:'weibo/fetch',
        callback() {
          setRefreshing(false);
        }
      });
    }
  }

  function renderHotList() {
    const { hot } = props;
    const items = hot.minute.map(item => (
      <li onClick={() => handleItemClick(item.scheme)} key={item.desc}>
        <img src={item.pic} />
        <span>{item.desc}</span>
        {item.desc_extr && <span className={styles.watched}>{item.desc_extr}</span>}
        {item.icon && <img src={item.icon} />}
      </li>
    ));
    return (
      <QueueAnim
        component="ul"
        className={styles.list}
        type={['right', 'left']}
      >
        {items}   
      </QueueAnim>
    );
  }
  function renderYaowenList() {
    const { yaowen } = props;
    if (yaowen.length) {
      const items = yaowen.map(item => (
        <li onClick={() => handleItemClick(item.scheme)} key={item.title_sub}>
            <h4>{item.title_sub}</h4>
            <span>{item.desc}</span>
        </li>
      ));
      return (
        <QueueAnim
          component="ul"
          className={styles.yaowenList}
          type={['right', 'left']}
        >
          {items}   
        </QueueAnim>
      );
    }
  }
  function renderTrendingList() {
    const { hot } = props;
    const items = hot.trending.map(item => (
      <li onClick={() => handleItemClick(item.scheme)} key={item.desc}>
        <img src={item.pic} />
        <span>{item.desc}</span>
        {item.desc_extr && <span className={styles.watched}>{item.desc_extr}</span>}
        {item.icon && <img src={item.icon} />}
      </li>
    ));
    return (
      <ul
        className={styles.list}
      >
        {items}   
      </ul>
    );
  }

  function handleTabClick(row: any, index: number) {
    if (activeTab !== index) {
      setActiveTab(index);
      if (index === 0) {
        props.dispatch({
          type: 'weibo/fetch',
          callback() {
            if (yaowenTimer && !bothTimer) {
              return registTimer('both');
            }
            if (!hotTimer && !bothTimer) {
              registTimer('hot');
            }
          }
        });
      }
      if (index === 1) {
        props.dispatch({
          type: 'weibo/fetchYaowen',
          callback() {
            if (hotTimer && !bothTimer) {
              return registTimer('both');
            }
            if (!yaowenTimer && !bothTimer) {
              registTimer('yaowen');
            }
          }
        });
      }
      if (index === 2) {
        // navigator.geolocation.getCurrentPosition(info => {
        //   const { coords: {accuracy, latitude, longitude} } = info;
        //   console.log(accuracy, latitude, longitude)
        // });
      }
    }
  }


  return (
    <div className={styles.weibo} ref={containerRef}>
      <header
        key="header"
        style={{
          top: (!inviewport && scroll.top) ? `-${scroll.top - lastScrollTop}px` : 0
        }}
        ref={headerRef}
      >
       <QueueAnim
        type={['bottom', 'top']}
       >
        <h3 key="h3">微博热搜</h3>
       </QueueAnim>
      </header>
      <QueueAnim
        type={['right', 'left']}
      >
        <div key="banner" className={styles.banner}>
          <img src="//simg.s.weibo.com/20181226161247_750_350.png"/>
        </div>
      </QueueAnim>
      <div style={{position: 'relative'}}>
        <div className={styles.observe} ref={observeRef}></div>
        <Tabs 
          tabs={tabs}
          page={activeTab}
          swipeable={false}
          animated={false}
          onTabClick={handleTabClick}
          renderTabBar={renderTabBar}
        >
          <div>
            <p className={styles.tip}>实时热点，每分钟更新一次</p>
            {renderHotList()}
            <p className={styles.tip}>实时上升热点</p>
            {renderTrendingList()}
          </div>
          <div>
            <p className={styles.tip}>实时热点，每分钟更新一次</p>
            {renderYaowenList()}
          </div>
          <div>
            <p className={styles.tip}>同城用户在关注</p>
            <div className={styles.failed}>
              位置信息获取失败
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}


export default connect(mapStateToProps)(Weibo);