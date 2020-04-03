/**
 * 
 * 数据代理的内核
 * @param {*} data 需要绑定的数据
 * @param {*} cb 触发set后的回调
 */
import { assert } from './common.js'
export function createProxy(data, staticData, cb){
  assert(data, 'data is required');
  assert(cb, 'cb is required');
  assert(typeof cb=='function', 'cb must be function');

  let res;
  if(data instanceof Array){
    res=[];

    for(let i=0;i<data.length;i++){
      if(typeof data[i]=='object'){
        res[i]=createProxy(data[i], staticData, cb);
      }else{
        res[i]=data[i];
      }
    }
  }else{
    res={};

    for(let key in data){
      assert(!key.startsWith('$'), 'data key must not be $');

      if(typeof data[key]=='object'){
        res[key]=createProxy(data[key], staticData, cb);
      }else{
        res[key]=data[key];
      }
    }
  }

  return new Proxy(res, {
    get(data, name){
      if(staticData&&staticData[name]){
        return staticData[name];
      }else{
        return data[name];
      }
    },
    set(data, name, val){
      if(typeof val=='object'){
        data[name]=createProxy(val, staticData, cb);
      }else{
        data[name]=val;
      }

      cb(name);

      return true;
    }
  });
}
