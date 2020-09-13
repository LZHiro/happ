import React from 'react';
import styles from './index.less';
import { PlusCircleOutlined } from '@ant-design/icons';

export default () => {
  return (
    <div className={styles.stack}>
      <header>
        <ul>
          <li>
            <h3>3355.37</h3>
            <div className={styles.upDownPer}>
              <span>上证指数</span>
              <span>-0.87%</span>
            </div>
          </li>
          <li>
            <h3>13656.66</h3>
            <div className={styles.upDownPer}>
              <span>深证成指</span>
              <span>-0.84%</span>
            </div>
          </li>
          <li>
            <h3>2732.15</h3>
            <div className={styles.upDownPer}>
              <span>创业板指</span>
              <span>-0.54%</span>
            </div>
          </li>
        </ul>
      </header>
      <div className={styles.table}>
        <div className={styles.head}>
          <div><PlusCircleOutlined className={styles.plus} />编辑</div>
          <div>最新</div>
          <div>涨跌</div>
          <div>涨幅</div>
        </div>
        <div className={styles.row}>
          <div>
            <h4>桃李面包</h4>
            <span className={styles.code}>603866</span>
          </div>
          <div>
            <h3 className={styles.price}>61.18</h3>
          </div>
          <div className={styles.tend}>-4.93</div>
          <div className={styles.tend}>-7.46%</div>
        </div>
        <div className={styles.row}>
          <div>
            <h4>桃李面包</h4>
            <span className={styles.code}>603866</span>
          </div>
          <div>
            <h3 className={styles.price}>61.18</h3>
          </div>
          <div className={styles.tend}>-4.93</div>
          <div className={styles.tend}>-7.46%</div>
        </div>
      </div>
    </div>
  );
}
