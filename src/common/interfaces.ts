export interface RouterHashes {
    [key:string]:any | {[key:string]:any}
}

export interface kvpairs {[key:string]:any | {[key:string]:any} | {[key:string]:{[key:string]:any}}}

export interface ResponseData {
    error: number,
    message: string,
    data: any
}
