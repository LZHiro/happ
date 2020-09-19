import React, { useEffect } from 'react';
import styles from './index.less';
import { Tabs } from 'antd-mobile';
import { connect, Dispatch, WeiboStateType, HotItem } from 'umi';
import { ConnectState } from '@/models/connect';
import { Modal } from 'antd-mobile';


interface WeiboProps extends WeiboStateType {
  dispatch: Dispatch;
}

const mapStateToProps = ({ weibo: { hot }, loading }: ConnectState) => ({
  loading: loading.effects['weibo/fetch'],
  hot
});

const Weibo:React.FC<WeiboProps> = (props) => {
  useEffect(() => {
    props.dispatch({
      type: 'weibo/fetch'
    });
  }, [])
  const tabs = [{
    title: '热搜榜'
  }, {
    title: '要闻榜'
  }, {
    title: '同城榜'
  }];

  function handleItemClick(item: HotItem) {
    if (item.scheme) {
      Modal.alert('This action will jump to Weibo.', 'Are you sure?', [
        { text: 'Cancel', style: 'default', onPress() {} },
        { text: 'Got it', onPress(){location.assign(item.scheme)} },
      ]);
    }
  }

  function HotList() {
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
      <ul className={styles.list}>
        {items}   
      </ul>
    );
  }

  return (
    <div className={styles.weibo}>
        <header>
          <h3>微博热搜</h3>
        </header>
        <div className={styles.banner}>
          <img src="//simg.s.weibo.com/20181226161247_750_350.png"/>
        </div>
        <div className={styles.category}>
          <Tabs 
            tabs={tabs}
            initialPage={0}
            swipeable={false}
            animated={false}
          >
            <div>
              <p className={styles.tip}>实时热点，每分钟更新一次</p>
              <HotList />
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