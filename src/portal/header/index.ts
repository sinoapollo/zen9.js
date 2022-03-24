import * as Global from "../global"
import html from './index.html'

import { PageBase } from "../../common/pagebase";

export class Header extends PageBase {
    constructor() {
        super(html, /*styles*/{}, "/header");
    }
    renderByTemplate(template : string, inData = {}, pages : PageBase [] = [this], container: HTMLElement = document.body): void {
        super.renderByTemplate(template, Object.assign(
            {
                curUser : Global.curUser
            },
            inData
        ), pages, container);
    }
}  