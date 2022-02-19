import {
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import Head from 'next/head';

export interface HeadProps {
  pageTitle: string;
  pageDescription: string;
  topBarTitle: string;
}

export default function AppHead({
  pageTitle,
  pageDescription,
  topBarTitle,
}: HeadProps) {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          borderBottom: 1,
          borderColor: (theme) =>
            theme.palette.mode === 'light' ? grey[300] : grey[900],
          backdropFilter: 'blur(10px)',
        }}
        enableColorOnDark
      >
        <Toolbar>
          <Typography variant="h6" component="div">
            {topBarTitle}
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
