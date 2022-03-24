// Modules
import { RouterRoot } from '../../common/router';
import { Header } from '../header';
import { Home } from '../home';

export class Router extends RouterRoot {
  start():void {
    super.addRouter({
      "/home": Home,  //用于创建新的Module路径
      "/header": Header //仅用于Template
    },
    0);
    super.start();
  }

}