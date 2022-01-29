import { AppBar, Slide, Toolbar, Typography, useScrollTrigger } from "@mui/material";
import Head from "next/head";

export interface HeadProps {
  pageTitle: string,
  pageDescription: string,
  topBarTitle: string
}

export default function AppHead({ pageTitle, pageDescription, topBarTitle }: HeadProps) {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name='description' content={pageDescription} />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Slide appear={false} direction='down' in={!useScrollTrigger()}>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" component="div">
              {topBarTitle}
            </Typography>
          </Toolbar>
        </AppBar>
      </Slide>
      <Toolbar />
    </>
  )
}
