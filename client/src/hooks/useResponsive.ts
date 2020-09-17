import { useEffect, useState } from 'react';


interface ResponsiveConfig {
  [key: string]: number;
}
interface ResponsiveInfo {
  [key: string]: boolean;
}
let responsiveConfig: ResponsiveConfig = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
}
let info: ResponsiveInfo = {}

type Subscripber = () => void;
const subscribers = new Set<Subscripber>();

function calculate() {
  const width = window.innerWidth;
  const newInfo = {} as ResponsiveInfo;
  let shouldUpdate = false;
  for(let key in responsiveConfig){
    newInfo[key] = responsiveConfig[key] <= width;
    if(newInfo[key] !== info[key]){
      shouldUpdate = true;
    }
  }
  if(shouldUpdate){
    info = newInfo
  }
}

export function setResponsiveConfig(config: ResponsiveConfig) {
  responsiveConfig = config;
  if (info) {
    calculate();
  }
}


export default function useResponsive() {
  info = {};
  calculate();
  window.addEventListener('resize',() => {
    let oldInfo = info;
    calculate();
    if(oldInfo === info) return ;
    for(let subscriber of subscribers) {
      subscriber();
    }
  });
  const [ state, setState ] = useState<ResponsiveInfo>(info)
  
  useEffect(() => {
    const subscriber = () => {
      setState(info)
    }
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    }

  }, []);

  return state;
}