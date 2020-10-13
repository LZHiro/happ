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

const mapStateToProps = ({ weibo: { hot }, loading }: ConnectState) => ({
  loading: loading.effects['weibo/fetch'],
  hot
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

const Weibo:React.FC<WeiboProps> = (props) => {
  const observeRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [ refreshing, setRefreshing ] = useState(false);
  const [ activeTab, setActiveTab ] = useState(0);
  const [ lastScrollTop, setLastScrollTop ] = useState(0);
  
  useEffect(() => {
    props.dispatch({
      type: 'weibo/fetch'
    });
  }, []);


  const inviewport = useInViewport(observeRef);
  const headerInviewport = useInViewport(headerRef);
  const scroll = useScroll(containerRef);

  useEffect(() => {
    setLastScrollTop(scroll.top);
  }, [ inviewport ]);

  function handleItemClick(item: HotItem) {
    if (item.scheme) {
      Modal.alert('This action will jump to Weibo.', 'Are you sure?', [
        { text: 'Cancel', style: 'default', onPress() {} },
        { text: 'Got it', onPress(){location.assign(item.scheme)} },
      ]);
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
          top: `${headerRef.current.getBoundingClientRect().top + headerRef.current.clientHeight}px`
        } : {
          
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
      <li onClick={() => handleItemClick(item)} key={item.desc}>
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
  function renderTrendingList() {
    const { hot } = props;
    const items = hot.trending.map(item => (
      <li onClick={() => handleItemClick(item)} key={item.desc}>
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
    setActiveTab(index);
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
          </div>
          <div>
            <p className={styles.tip}>实时热点，每分钟更新一次</p>
          </div>
        </Tabs>
      </div>
    </div>
  );
}


export default connect(mapStateToProps)(Weibo);