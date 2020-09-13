import React, { useState } from 'react';
import styles from './index.less';
import { Tabs, Drawer, Card, TabBar, Icon } from 'antd-mobile';
import { MenuOutlined, SearchOutlined, HeartFilled } from '@ant-design/icons';

const tabs = [
  { title: 'Mine' },
  { title: 'WOW' },
  { title: 'Village' },
  { title: 'Video' },
]

const tabBarData = [{
  title: 'Local music',
  icon: '#iconmusic-note-copy'
}, {
  title: 'Managa download',
  icon: '#icondownload-copy'
}, {
  title: 'Stations',
  icon: '#iconmusic2-copy'
}, {
  title: 'Favs',
  icon: '#iconfav-copy'
}]

export default function Music() {

  const [ sideOpened, setSideOpened ] = useState(false);
  const [ sideZindex, setSideZindex ] = useState(-1);

  function sideChange() {
    setSideOpened( sideOpened => !sideOpened);
    if(sideOpened) {
      setTimeout(() => {
        setSideZindex(-1);
      }, 300);
    } else {
      setSideZindex(199);
    }
  }

  function MyTabBar() {
    const tabBarItems = tabBarData.map(item => {
      return (
        <TabBar.Item
          title={item.title}
          key={item.title}
          icon={(
            <svg className={styles.tabBarIcon} aria-hidden="true">
              <use xlinkHref={item.icon}></use>
            </svg>
          )}
          selected={false}
        >
        </TabBar.Item>
      );
    });
    return (
      <TabBar
        unselectedTintColor="#efeff1"
        tintColor="#efeff1"
        barTintColor="#434249"
      >
        {tabBarItems}
      </TabBar>
    )
  }

  return (
    <div className={styles.music}>
      <header>
        <MenuOutlined onClick={sideChange} className={styles.menuIcon} />
        <Tabs
          tabs={tabs}
          initialPage={0}
          tabBarBackgroundColor="rgba(0,0,0,0)"
          tabBarUnderlineStyle={{display:'none'}}
          tabBarActiveTextColor="white"
          tabBarInactiveTextColor="#c0bfc4"
        >
        </Tabs>
        <SearchOutlined className={styles.searchIcon} />
      </header>
      <div className={styles.sticky}>
        <div className={styles.account}>
          <Card>
            <Card.Header
              title={(<span style={{color:'white'}}>Hiro</span>)}
              thumb={(
                <svg className={styles.avatar} aria-hidden="true">
                  <use xlinkHref="#iconmusic1"></use>
                </svg>
              )}
            />
          </Card>
        </div>
        <MyTabBar />
      </div>
      <div className={styles.panel}>
        <div className={styles.main}>
            <div className={styles.title}>
              <h3>我的音乐</h3>
            </div>
          <ul>
            <li>
                <img src="http://p2.music.126.net/Zow38O4GtgwqMS7iBZDquA==/109951165267930316.jpg?imageView=1&type=webp&thumbnail=369x0" alt=""/>
                <HeartFilled className={styles.heart} />
                <p>我喜欢的音乐</p>
            </li>
            <li>
                <img src="http://p2.music.126.net/Zow38O4GtgwqMS7iBZDquA==/109951165267930316.jpg?imageView=1&type=webp&thumbnail=369x0" alt=""/> 
                <svg className={styles.fm} aria-hidden="true">
                  <use xlinkHref="#icondiantai-copy"></use>
                </svg>
                <p>私人FM</p>
            </li>
          </ul>
        </div>
        <div className={styles.recent}>
            <div className={styles.title}>
              <h3>Recent play</h3>
              <a>More <Icon style={{verticalAlign:'middle'}} type="right" color="#888888" /></a>
            </div>
            <ul>
              <li>
                <Card>
                  <Card.Header
                    title={(
                      <div className={styles.cardContent}>
                        <h4>全部已播放歌曲</h4>
                        <span>300 songs</span>
                      </div>
                    )}
                    thumb={(
                      <svg className={styles.avatar} aria-hidden="true">
                        <use xlinkHref="#iconmusic1"></use>
                      </svg>
                    )}
                  />
                </Card>
              </li>
              <li>
                <Card>
                  <Card.Header
                    title={(
                      <div className={styles.cardContent}>
                        <h4>全部已播放歌曲</h4>
                        <span>300 songs</span>
                      </div>
                    )}
                    thumb={(
                      <svg className={styles.avatar} aria-hidden="true">
                        <use xlinkHref="#iconmusic1"></use>
                      </svg>
                    )}
                  />
                </Card>
              </li>
            </ul>
        </div>
      </div>
      <Drawer
        style={{zIndex:sideZindex}}
        open={sideOpened}
        onOpenChange={sideChange}
        sidebar={(
          <h1 style={{background:'white',height:'100%', opacity:1+sideZindex /* 这里利用sideZindex为 -1 0 解决左右滑动产生的白边 */}}>hello</h1>
        )}
      >
        <span></span>
      </Drawer>
    </div>
  );
}
