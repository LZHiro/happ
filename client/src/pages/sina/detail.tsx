import React from 'react';
import styles from './detail.less';
import { RouteComponentProps } from 'react-router-dom';
import { Input } from 'antd';
import { SearchOutlined, LeftOutlined } from '@ant-design/icons';
import { history } from 'umi';

interface DetailProps extends RouteComponentProps {}

function Detail(props: DetailProps) {

  function handleBack() {
    history.go(-1);
  }
  return (
    <div className={styles.detail}>
      <header>
        <LeftOutlined onClick={handleBack} className={styles.back} />
        <Input allowClear placeholder="搜索微博" prefix={(<SearchOutlined className={styles.searchIcon} />)} />
      </header>
    </div>
  )
}

export default Detail