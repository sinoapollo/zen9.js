declare module '*.html' {
    const value: string;
    export default value
}
declare module '*.obj' {
    const value: string;
    export = value;
}
declare module '*.css' {
    const content: any;
    export default content;
}
declare module "*.svg" {
    const content: string;
    export default content;
}
  