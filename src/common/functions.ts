

// 解析location.ref中的search字符串
export function parseSearch(search: string | null):{[key:string]:string} {
  const result : {[key:string]:string} = {};
  const urlParams : URLSearchParams = new URLSearchParams(search + "");
  urlParams.forEach((val, idx, parent)=>{
    result[idx] = val;
  })
  return result;
}
