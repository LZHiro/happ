import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { notification, message } from 'antd';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

nprogress.configure({
  showSpinner: false,
});

declare global {
  interface Window {
    axiosSource: any;
  }
}
window.axiosSource = axios.CancelToken.source();

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.method && config.method.toUpperCase() === 'POST') {
      config.headers = {
        'Content-Type': 'application/json',
        ...config.headers,
      };
    }
    return config;
  },
  err => {
    notification.destroy();
    nprogress.done();
    notification.error({
      message: '网络异常',
      description: err.message,
    });
  },
);

axios.interceptors.response.use(
  config => {
    nprogress.done();
    return config;
  },
  err => {
    nprogress.done();
    if (!err.config.noAlert) {
      notification.destroy();
      notification.error({
        message: '网络异常',
        description: err.message,
      });
    }
  },
);

const checkStatus = (response: AxiosResponse) => {
  if (!response) {
    return Promise.reject('请求异常');
  }
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  nprogress.done();
  return Promise.reject('请求异常');
};

export interface ResponseParam extends AxiosResponse {
  code: number;
  message?: string;
}
export interface RequestParam extends AxiosRequestConfig {}

async function baseHandlerError(response: ResponseParam) {
  const { code } = response;
  switch (code) {
    case undefined:
      return {
        code: 200,
        data: 1,
      };
      break;
    case 500:
      message.warning(response.message);
      throw new Error(response.message);
      return null;
      break;
    default:
      return response;
  }
}

export const delay = (time: number): Promise<void> =>
  new Promise((resolve, reject) => setTimeout(resolve, time));

declare var process: {
  proxy?: string;
};

export default function request(url: string, ...rest: any[]) {
  let options = rest[0] || {};
  const handleError = options && options.noCheck ? (data: any) => data : baseHandlerError;
  let uri = url;
  if (process.proxy && !options.noProxy) {
    uri = process.proxy + url;
  }
  if (!options.formData) {
    options.data = JSON.stringify(options.data);
  } else {
    options.data = options.formData;
  }
  if (!options.noLoading) {
    nprogress.start();
  }
  return axios(uri, options)
    .then(checkStatus)
    .then(handleError)
    .catch(err => {
      return null;
    });
}
