import Document, { Head, Html, Main, NextScript } from "next/document";
import { JSX } from "react";

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="zh-CN">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
