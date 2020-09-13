import React from 'react';
import styles from './index.less';
import { Tabs } from 'antd-mobile';
import { history } from 'umi';

export default () => {

  const tabs = [{
    title: '热搜榜'
  }, {
    title: '要闻榜'
  }, {
    title: '同城榜'
  }];

  function toDetail() {
    history.push('/sina/123123');
  }

  return (
    <div className={styles.sina}>
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
              <ul className={styles.list}>
                <li>
                  <img src="//simg.s.weibo.com/20180205110043_img_search_stick%403x.png" />
                  <span>中国国际服务贸易交易会</span>
                  <span className={styles.watched}>562114545</span>
                  <img src="//simg.s.weibo.com/20190429_hot.png" />
                </li>
              </ul>
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
