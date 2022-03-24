import { Router } from '../router'

import html from './page.html';
import styles from './page.css';
import * as Global from "../global";

import axios from "axios";

import { PageBase } from "../../common/pagebase"

// 导出类
export class Page extends PageBase { //Home是 PageBase的子类，这个用于 没有子节点的节点页面
  constructor() {
    super(html, styles, "/home/page");

    axios.defaults.withCredentials = true;
  }
  render(search: string | null = null, container: HTMLElement = document.body): boolean {
    if (Global.curUser.userID == null) {
      //Router.go("/home/login");  //
    }
    this.loadTemplate(search, container); //调用异步函数，不等到执行完成就执行下一句代码了。
    return true;
  }
  async loadTemplate(search: string | null = null, container: HTMLElement = document.body) {
    container.innerHTML = "";
      try {
        const info = (await axios.get("data/info.json")).data;
        this.appendByTemplate({
            subTitle: "第二个页面",
            nums : info.nums
        }, container);
      }
      catch (err) {
        console.log(err);
      }
  }
  demofunc(index:string, val:string):void {
      alert("索引是 " + index + "，值是 " + val);
  }
}