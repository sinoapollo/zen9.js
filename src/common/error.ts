import html from "./error.html"
import styles from "./error.css"
import { PageBase } from "./pagebase"

export class E404 extends PageBase {
    constructor() {
        super(html, styles, "/error/e404");
    }
    render(search: string | null = null, container:HTMLElement = document.body):boolean {
        container.innerHTML = "";
        this.appendByTemplate({"errorString": "404 错误"}, container);
        return true;
    }
}

export class E000 extends PageBase {
    constructor() {
        super(html, styles, "/error/e000");
    }
    render(search: string | null = null, container:HTMLElement = document.body):boolean {
        container.innerHTML = "";
        this.appendByTemplate({"errorString": "未知错误"}, container);
        return true;
    }
}