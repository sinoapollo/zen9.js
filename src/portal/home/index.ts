import html from './index.html';        //把 ./index.html 作为 html 字符串 导入
import styles from './index.css';       //把 ./index.css 作为 styles 对象 导入

import * as Global from "../global";    //注意不同点，这句话的作用是把所有 ../global/index.ts里定义的内容作为Global对象的属性/方法

import axios from "axios";
import { RootPageBase } from "../../common/pagebase"
import { Page } from './page';

// 导出类
export class Home extends RootPageBase { //Home是 RootPageBase的子类，这个用于含有子节点的节点页面
  constructor() {
      //创建router中 /home的子项
      //super的第3个参数一定要和router中指定的key一致，否则会影响寻找template的路径
      //super的第4个参数是用来指定 /home/index 为 访问默认路由项，如果省略，则不指定
    super(html, styles, "/home", {
      '/home': {
        "/index": Home,
        "/page": Page,
      }
    },
    "/home/index");

    axios.defaults.withCredentials = true;
  }
  render(search: string | null = null, container: HTMLElement = document.body): boolean {
    if (Global.curUser.userID == '') {
        Global.curUser.userID = 'CAA User';
      //Router.go("/home/login");  //
    }
    this.loadTemplate(search, container); //调用异步函数，不等到执行完成就执行下一句代码了。
    return true;
  }
  async loadTemplate(search: string | null = null, container: HTMLElement = document.body) {
    container.innerHTML = "";
      try {
        const info = (await axios.get("data/info.json")).data; //从URL请求数据，可以是相对路径，也可以是绝对路径
        console.log(info); // 打印info的内容，这是调试语句，在浏览器的console（控制台）可以看到输出结果
        this.appendByTemplate({
            subTitle: "索引",
            vals : info.vals,
            showTitle : true
        }, container);
  
      }
      catch (err) {
        console.log(err);
      }
  }
}
