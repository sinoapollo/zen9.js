// Modules
import {E404, E000} from "./error";
import {RouterBase} from "./routerbase"

export class RouterRoot extends RouterBase {
  start():void {
    super.addRouter({
      '/error' : {
        '/e404': E404,
        '/e000': E000,
      }
    },
    0);
    super.start();
  }

}