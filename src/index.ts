import "./assets/style.css"
// 引入 router
import {Router} from './portal/router'
import * as Global from "./common/global"
import i18n from './portal/i18n'

Object.assign(Global.i18n, i18n);//用于多语言
(new Router).start();
