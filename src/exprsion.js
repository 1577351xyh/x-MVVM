import { assert } from './common.js'

/**
 * 1.表达式求解
 * @param {*} str 
 * @param {*} data 
 */
export function exprsion(str, data) {

  // let n = str.indexOf("'");
  // str.indexOf("'", n + 1)

  // let arr = [];
  // for (const key in data) {
  //   arr.push(`let ${key} = ${JSON.stringify(data[key])};`)
  // }
  // arr.push(str)



  // let s = arr.join('\n');
  // return eval(s)
}

/**
 * 解析字符串和表达式
 */
function parseExpr(str){
  let arr=[];

  while(1){
    let n=str.search(/'|"/);
    if(n==-1){
      arr.push({exp: str});
      break;
    }

    let m=n+1;
    while(1){
      m=str.indexOf(str[n], m);
      if(m==-1){
        throw new Error('引号没配对');
      }

      if(str[m-1]=='\\'){
        m++;
        continue;
      }else{
        break;
      }
    }

    arr.push({expr: str.substring(0, n)});
    arr.push(str.substring(n+1, m));
    str=str.substring(m+1);
  }

  return arr;
}