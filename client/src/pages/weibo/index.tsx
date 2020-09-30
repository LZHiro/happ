import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import styles from './index.less';
import { Tabs } from 'antd-mobile';
import { connect, Dispatch, WeiboStateType, HotItem, Models } from 'umi';
import { ConnectState } from '@/models/connect';
import { Modal, PullToRefresh } from 'antd-mobile';
import useInViewport from '@/hooks/useInViewport';
import QueueAnim from 'rc-queue-anim';
import classnames from 'classnames';
import { findDOMNode } from 'react-dom';

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
  const pullRef = useRef<PullToRefresh>(null);
  const [ pullHeight, setPullHeight ] = useState(document.documentElement.clientHeight);
  const [ refreshing, setRefreshing ] = useState(false);
  const [ activeTab, setActiveTab ] = useState(0);
  

  useLayoutEffect(() => {
    const dom = pullRef.current as PullToRefresh;
    setPullHeight(pullHeight - findDOMNode(dom).offsetHeight);
  }, [])

  useEffect(() => {
    props.dispatch({
      type: 'weibo/fetch'
    });
  }, []);


  const inviewport = useInViewport(observeRef);


  function handleItemClick(item: HotItem) {
    if (item.scheme) {
      Modal.alert('This action will jump to Weibo.', 'Are you sure?', [
        { text: 'Cancel', style: 'default', onPress() {} },
        { text: 'Got it', onPress(){location.assign(item.scheme)} },
      ]);
    }
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

  const categoryClass = classnames({
    [`${styles.fixedBar}`]: !inviewport,
  });

  return (
    <div className={styles.weibo}>
      <PullToRefresh
        damping={60}
        ref={pullRef}
        style={{
          height: pullHeight,
        }}
        direction="down"
        refreshing={refreshing}
        onRefresh={handleRefresh}
      >
       {inviewport && (
         <QueueAnim
          type={['top', 'bottom']}
          component="header"
         >
            <h3 key="h3">微博热搜</h3>
         </QueueAnim>
       )}
        <QueueAnim
          type={['right', 'left']}
        >
          <div key="banner" className={styles.banner}>
            <img src="//simg.s.weibo.com/20181226161247_750_350.png"/>
          </div>
        </QueueAnim>
        <div className={categoryClass}>
          <div ref={observeRef}></div>
          <Tabs 
            tabs={tabs}
            page={activeTab}
            swipeable={false}
            animated={false}
            onTabClick={handleTabClick}
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
      </PullToRefresh>
    </div>
  );
}


export default connect(mapStateToProps)(Weibo);