import {RouterBase, getModule} from './routerbase'
//import {loadHTMLTemplates} from './functions'
//import axios from "axios"
import {kvpairs, RouterHashes} from './interfaces'
import * as Global from "./global"

export class PageBase {
    templates : kvpairs;
    moduleName : string;
    constructor(html : any, styles : any, moduleName = "") {
        /* //另一种解析html字符串的方法
        let htmlDoc = new DOMParser().parseFromString(html, "text/html");
        htmlDoc.head.childNodes.forEach(element => {
            document.head.appendChild(element.cloneNode(true));
        });*/
        this.moduleName = moduleName;
        this.templates = {};
        const htmlDoc = document.createElement("root");
        htmlDoc.innerHTML = eval("`" + html.trim().replace(/\$\{/g, "#{").replace(/#\{styles/g, "${styles").replace("`", "\\`") + "`").replace(/#\{/g, "${");
        this.formatTemplate(htmlDoc).forEach((val, inx, array)=>{
            this.templates[(val.getAttribute("name") + "").replace(this.moduleName, "").replace("/", "")] = val.innerHTML;
        });
        // 如果在html中定义了<template name='default'>，则用,如果没有，就把所有内容加入到一个新的template元素中去
    }
    render(search: string | null = null, container:HTMLElement | null = document.body): boolean {
        //do common jobs
        console.log(this);
        return false;
    }
    formatTemplate(ele:HTMLElement):HTMLElement [] {
        const result = [];
        const findtemplate = (val:any)=>{
            if (val.nodeName.toLowerCase() == "template") {
                val = (val as HTMLTemplateElement).content;
            }
            for (let i = val.childElementCount - 1; i >= 0; i --) {
                const child = val.children[i];
                findtemplate(child);
                if (child.nodeName.toLowerCase() == "template") {
                    result.push(...this.formatTemplate(child as HTMLElement));
                    val.removeChild(child);
                }
            }
        }
        findtemplate(ele);
        if (ele.tagName.toLowerCase() != "template") {
            if (ele.innerHTML.replace(/s/g, '').length > 0) {
                const local_html = document.createElement("template");//eval(`<template name="default"></template>`);
                local_html.setAttribute("name", "default");
                local_html.innerHTML = ele.innerHTML;
                result.unshift(local_html);
            }
        }
        else {
            if ((ele.getAttribute("name") + "").length == 0) {
                throw Error(this.moduleName + " : template has no name.");
            }
            result.unshift(ele);
        }
        return result;
    }
    /*async loadUrl(url: string, container:HTMLElement) {
        return (await axios.get(url)).data;
    }*/
    loadTemplateData(templateDataString : string | null, data = {}) : any {
        return templateDataString == null || templateDataString.length <= 2 ? data : {...data, ...eval("(" + templateDataString + ")")};
    }
    renderByTemplate(template : string, inData = {}, pages : PageBase [], container: HTMLElement = document.body) {
        const i18n = Global.i18n[Global.i18n.locale];
        const html : HTMLElement = document.createElement("root");//(new DOMParser().parseFromString(eval("`" + templateString + "`"), "text/html")).body;
        html.innerHTML = template;
        const getTemplateName = (templateName : string) => {
            if (templateName.length == 0) return "default";
            return templateName;
        }
        const getTemplatePage = (templateName : string) => {
            if (template.endsWith("/")) {
                template = template.substring(0, template.length - 1);
            }
            if (templateName.startsWith("/")) {
                // 使用指定module的default模板
                if (templateName.lastIndexOf("/") == 0) {
                    if (templateName == this.moduleName) return this;
                    return getModule(templateName);
                }    
                try {
                    return getModule(templateName);
                }
                catch (ex : any) {
                    const moduleName = templateName.substring(0, templateName.indexOf("/", 1));
                    let page : PageBase | null = null;
                    pages.forEach((val, inx, array)=>{
                        if (val.moduleName == moduleName) {
                            page = val;
                            return false;
                        }
                    });
                    if (page == null) {
                        page = getModule(moduleName);
                    }
                    if (page != null && Object.keys(page.templates).indexOf(getTemplateName(templateName.replace(moduleName, "").replace("/", ""))) >= 0) {
                        return page;
                    }
                    throw Error("template undefined : " + templateName);
                }
            }
            else {
                for(let inx = 0; inx < pages.length; inx ++) {
                    if (Object.keys(pages[inx].templates).indexOf(templateName) >= 0) {
                        return pages[inx];
                    }
                }
            }
            throw Error("template undefined : " + templateName);
        };
        const dealEvents = (node : Element)=> {
            for (const attribute of node.attributes) {
                if (attribute.name.toLowerCase() == "href") {
                    if (node.getAttribute("onclick")) {
                        break;
                    }
                    node.addEventListener("click", (event : any)=>{
                        if (attribute.value.startsWith("http://") || attribute.value.startsWith("https://"))
                            window.open(attribute.value);
                        else
                            RouterBase.go(attribute.value);
                    }, false);
                    node.removeAttribute(attribute.name);
                    break;
                }
                else if (attribute.name.toLowerCase().startsWith("on")) {
                    //<button onclick="this.runTest();">Sign in</button> 调用模板所属类定义中的非静态成员函数，这里的this不是指button, 如果要象原来使用this指向button可以用evt参数
                    node.removeAttribute(attribute.name);
                    node.addEventListener(attribute.name.toLowerCase().replace("on", ""), (event:any)=>{
                        eval(attribute.value);
                    }, false);
                }
            }
        }
        for (const childNode of html.childNodes) {
            if (childNode.nodeType == Node.TEXT_NODE) {
                const data = inData;
                childNode.textContent= (eval("`" + childNode.textContent + "`")).trim();
                container.appendChild(childNode.cloneNode(true));
            }
            else if (childNode.nodeType == Node.ELEMENT_NODE) {
                const element = childNode as Element;
                //<use-template name='' func=''>
                if (element.tagName.toLowerCase() == "use-template") {
                    const data = inData;
                    //const useTemplateName = getTemplateName(eval("`" + element.getAttribute("name") + "`"));
                    const useTemplateName = element.getAttribute("name") ? eval("`" + element.getAttribute("name") + "`") : "default";
                    const func = element.getAttribute("func") ? eval("`" + element.getAttribute("func") + "`") : null;
                    const page = getTemplatePage(useTemplateName);
                    if (page != this)
                        pages.push(page);
                    if (typeof func == "function") {
                        func(page.templates[getTemplateName(useTemplateName.replace(page.moduleName, "").replace("/", ""))], data, pages, container);
                    }
                    else {
                        page.renderByTemplate(page.templates[getTemplateName(useTemplateName.replace(page.moduleName, "").replace("/", ""))], data, pages, container);
                    }
                    if (page != this)
                        pages.pop();
                }
                //<if condition="${data.editable}">
                else if(element.tagName.toLowerCase() == "if") {
                    const data = inData;
                    const condition = element.getAttribute("condition") ? eval("`" + element.getAttribute("condition") + "`") : 'true';
                    if (condition != 'false') {
                        this.renderByTemplate(element.innerHTML, data, pages, container);
                    }
                }
                //<loop template='' from='' count='' step='' data="" >
                else if(element.tagName.toLowerCase() == "loop") {
                    const data = Object.assign({_index_ : 0, _value_ : ''}, inData);
                    Object.assign(data, this.loadTemplateData(element.getAttribute("data"), inData));
                    const loopFrom = parseInt(element.getAttribute("from") ? eval("`" + element.getAttribute("from") + "`") : 0);
                    const loopCount = parseInt(element.getAttribute("count") ? eval("`" + element.getAttribute("count") + "`") : 0);
                    const loopStep = parseInt(element.getAttribute("step") ? eval("`" + element.getAttribute("step") + "`") : 0);
                    const loopTemplate = element.getAttribute("template") ? eval("`" + element.getAttribute("template") + "`") : null;
                    let templateString = element.innerHTML;
                    let page : PageBase;
                    if (loopTemplate) {
                        page = getTemplatePage(loopTemplate);
                        if (page != this)
                            pages.push(page);
                        templateString = page.templates[getTemplateName(loopTemplate.replace(page.moduleName, ""))];
                    }
                    else {
                        page = this;
                    }
                    for (let _index_ = loopFrom; _index_ < loopFrom + loopCount * loopStep; _index_ += loopStep) {
                        Object.assign(data, {_index_ : _index_, _value_ : _index_});
                        page.renderByTemplate(templateString, data, pages, container);
                    }
                    if (page != this) {
                        pages.pop();
                    }
                }
                //<list template="" data-list="" data-object="" data="">
                else if(element.tagName.toLowerCase() == "list") {
                    const data = Object.assign({} , inData);
                    if (element.getAttribute("data"))
                        Object.assign(data, this.loadTemplateData(element.getAttribute("data"), inData));
                    const listTemplate = element.getAttribute("template") ? eval("`" + element.getAttribute("template") + "`") : null;
                    const arrayData : any = element.getAttribute("data-list") ? eval(element.getAttribute("data-list") + "") : null;
                    const objData : any = element.getAttribute("data-object") ? eval(element.getAttribute("data-object") + "") : null;
                    let templateString = element.innerHTML;
                    let page : PageBase;
                    if (listTemplate) {
                        page = getTemplatePage(listTemplate);
                        if (page != this)
                            pages.push(page);
                        templateString = page.templates[getTemplateName(listTemplate.replace(page.moduleName, "").replace("/", ""))];
                    }
                    else {
                        page = this;
                    }
                    if (arrayData)
                        arrayData.forEach((val: any, inx : any, array : any) => {
                            Object.assign(data, {_index_ : inx, _value_ : val});
                            page.renderByTemplate(templateString, data, pages, container);
                        });
                    if (objData)
                        Object.entries(objData).forEach(([key, value]) => {
                            Object.assign(data, {_key_ : key, _value_ : value});
                            page.renderByTemplate(templateString, data, pages, container);
                        });                
                    if (page != this) {
                        pages.pop();
                    }
                }
                //<select data-list="" data-object="" template="" data="">
                else if (element.tagName.toLowerCase() == "select") {
                    const data = Object.assign({_index_ : "", _value_ : {}} , inData);
                    Object.assign(data, this.loadTemplateData(element.getAttribute("data"), inData));
                    const optionTemplate = element.getAttribute("template") ? eval("`" + element.getAttribute("template") + "`") : null;
                    const arrayData : any = element.getAttribute("data-list") ? eval(element.getAttribute("data-list") + "") : null;
                    const objData : any = element.getAttribute("data-object") ? eval(element.getAttribute("data-object") + "") : null;

                    let newNode = document.createElement("root");
                    newNode.innerHTML = eval("`" + (element.cloneNode() as HTMLElement).outerHTML + "`");
                    newNode = newNode.firstElementChild?.cloneNode() as HTMLElement;
                    newNode.removeAttribute("template");
                    newNode.removeAttribute("data-list");
                    newNode.removeAttribute("data-object");
                    newNode.removeAttribute("data");
                    dealEvents(newNode);
                    container.appendChild(newNode);

                    let optionTemplateString = "";
                    for (const option of element.children) {
                        if (option.outerHTML.indexOf("_index_") >= 0 || option.outerHTML.indexOf("_key_") >= 0 || option.outerHTML.indexOf("_value_") >= 0) {
                            optionTemplateString = option.outerHTML;
                        }
                        else {
                            this.renderByTemplate(option.outerHTML, data, pages, newNode);
                        }
                    }
                    let page : PageBase;
                    if (optionTemplate) {
                        page = getTemplatePage(optionTemplate);
                        if (page != this)
                            pages.push(page);
                        optionTemplateString = page.templates[getTemplateName(optionTemplate.replace(page.moduleName, "").replace("/", ""))];
                    }
                    else {
                        page = this;
                    }
                    if (arrayData)
                        arrayData.forEach((val: any, inx : any, array : any) => {
                            Object.assign(data, {_index_ : inx, _value_ : val});
                            page.renderByTemplate(optionTemplateString, data, pages, newNode);
                        });
                    if (objData)
                        Object.entries(objData).forEach(([key, value]) => {
                            Object.assign(data, {_key_ : key, _value_ : value});
                            page.renderByTemplate(optionTemplateString, data, pages, newNode);
                        });
                    if (page != this) {
                        pages.pop();
                    }
                }
                else {
                    const data = inData;
                    let newNode = document.createElement("root");
                    newNode.innerHTML = eval("`" + (element.cloneNode() as HTMLElement).outerHTML + "`");
                    newNode = newNode.firstElementChild?.cloneNode() as HTMLElement;
                    dealEvents(newNode);
                    container.appendChild(newNode);
                    this.renderByTemplate(element.innerHTML, inData, pages, newNode);
                }
            }
        }
    }
    appendByTemplate(data: any, container = document.body) {
        this.renderByTemplate(this.templates["default"], data, [this], container);
    }
}

export class RootPageBase extends PageBase {
    moduleHashes : RouterHashes = {};
    constructor(html : any, styles: any, moduleName: string, moduleHashes : any, defaultHashKey = '') {
        super(html, styles, moduleName);
        this.moduleHashes = moduleHashes;
        // 插入当前子路由
        if (typeof RouterBase.hashes[Object.keys(this.moduleHashes)[0]] == 'function') {
            RouterBase.hashes = Object.assign(RouterBase.hashes, this.moduleHashes);
            if (defaultHashKey.length > 0) {
                RouterBase.defaulHashKey = defaultHashKey;
            }
        }
    }
    /*rebuildRouter() {
        
    }*/
}