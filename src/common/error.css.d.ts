declare namespace ErrorCssNamespace {
  export interface IErrorCss {
    mainBlock: string;
  }
}

declare const ErrorCssModule: ErrorCssNamespace.IErrorCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ErrorCssNamespace.IErrorCss;
};

export = ErrorCssModule;
