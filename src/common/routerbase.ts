import {RouterHashes} from "./interfaces"

// v1.5 2022-01-17

export class RouterBase {
  // 路由以"/"开始，名称中不能使用"+"号
  public static hashes: RouterHashes = {
  };

  public static defaulHashKey = '';//'/error/e404';

  start():void {
    this.reverseRouterHashes('');
    // https://developer.mozilla.org/en-US/docs/Web/Events/popstate
    const startHash: string = location.hash.replace(/^#/, '');
    window.addEventListener('popstate', () => {
      RouterBase.go(startHash, '', location.search);
    });
    const index = startHash.indexOf("?");
    if (index >= 0) {
      RouterBase.go(startHash.substring(0, index), '', startHash.substring(index));
    }
    else {
      RouterBase.go(startHash, '', location.search);
    }  
  }

  //建立RouterHashes表
  reverseRouterHashes(hash : string) {
    if (typeof eval("RouterBase.hashes" + hash) == 'function') {
      eval("new RouterBase.hashes" + hash + "()");
    }
    if (typeof eval("RouterBase.hashes" + hash) == 'object') {
      Object.keys(eval("RouterBase.hashes" + hash)).forEach((val, inx, array)=>{
        this.reverseRouterHashes(hash + "['" + val + "']");
      });
    }
  }


  // hashes 要增加的路由， newDefaultHashIndex 设置新的默认路由
  addRouter(hashes : RouterHashes, newDefaultHashIndex = -1) {
    RouterBase.hashes = Object.assign(hashes, RouterBase.hashes);
    if (newDefaultHashIndex >= 0)
      RouterBase.defaulHashKey = Object.keys(hashes)[newDefaultHashIndex];
  }

  public static go(toHash : string, fromHash = '', search = ''):void {
    const index = toHash.indexOf("?");
    if (index >= 0) {
      search = toHash.substring(index);
      toHash = toHash.substring(0, index);
    }
    toHash = formatHash(toHash.startsWith("/") ? toHash : (fromHash + "/" + toHash));
    history.pushState({}, '', window.location.origin + window.location.pathname + search + "#" + toHash);
    loadModule('/' + toHash.replace(/^(\/)*/, ""), search);
  }
}

export function formatHash(hash:string) : string {
  const localHashes : string[] = hash.split("/");
  for (let i = 0; i < localHashes.length;  i ++) {
    if (localHashes[i] === '..') {
      localHashes[i] = '';
      for (let j = i - 1; j >= 0; j --) {
        if (localHashes[j].length > 0) {
          localHashes[j] = '';
          break;
        }
      }
    }
    else if (localHashes[i] === '.') {
      localHashes[i] = '';
    }
  }
  hash = '';
  for (const localHash of localHashes) {
    if (localHash.length > 0) {
      hash += '/' + localHash;
    }
  }
  return hash;
}

export function loadModule(hash: string, search: string | null = null, htmlElement:HTMLElement = document.body):void {
  try {
    getModule(hash).render(search, htmlElement);
  }
  catch (ex : any) {
    if (ex instanceof EvalError || ex.message == "undefined") {
      getModule("/error/e404").render(search, htmlElement);
    }
    else {
      getModule("/error/e000").render(search, htmlElement);
    }
  }
}

export function getModuleClass(hash:string) : any {
  hash = (hash == "/" ? hash = RouterBase.defaulHashKey : hash).replace(/\//g, "']['/").substring(2) + "']";
  switch (typeof eval("RouterBase.hashes" + hash)) {
    case 'function':
      break;
    case 'object':
      hash += "['" + Object.keys(eval("RouterBase.hashes" + hash))[0] + "']";
      break;
    case 'undefined':
      throw Error("undefined");
      break;
    default:
      throw Error("unkown");
      break;
  }
  return eval("RouterBase.hashes" + hash)
  //return eval("new RouterBase.hashes" + hash + "()")
}

export function getModule(hash:string) : any {
  return new (getModuleClass(hash))();
}
/*子类继承DEMO，注意路径格式

export class Router extends RouterBase {
  start():void {
    super.addRouter({
      '/gallery' : Gallery
    },
    0);
    super.start();
  }

}
*/