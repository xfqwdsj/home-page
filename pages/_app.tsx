import Image from 'next/image';
import type { AppProps } from 'next/app';
import { useEffect, useMemo } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
  alpha,
  Box,
  Container,
  createTheme,
  CssBaseline,
  styled,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from '@mui/material';
import AppHead from '../components/page/head';
import AV from 'leancloud-storage/core';
import { Adapters } from '@leancloud/adapter-types';
import vercel from '../public/vercel.svg';

const App = ({ Component, pageProps }: AppProps) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        components: {
          MuiTypography: {
            styleOverrides: {
              root: {
                wordWrap: 'break-word',
              },
            },
          },
          MuiBackdrop: {
            styleOverrides: {
              root: {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(5px)',
              },
            },
          },
        },
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  const StyledImage = styled(Image)(({ theme }) => ({
    filter: `invert(${theme.palette.mode === 'light' ? '0%' : '100%'})`,
  }));

  useEffect(() => {
    (async () => {
      const adapter = await import('@leancloud/platform-adapters-browser');
      AV.setAdapters(adapter as unknown as Adapters);
      AV.init({
        appId: 'nSOTaTjLRFryFL00StQsb3lS-MdYXbMMI',
        appKey: '3zBz5tMkTpEdoFCnQ7Xqxx65',
      });
    })();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {pageProps.head ? (
        <AppHead
          pageTitle={pageProps.head.pageTitle}
          pageDescription={pageProps.head.pageDescription}
          topBarTitle={pageProps.head.topBarTitle}
        />
      ) : (
        <AppHead
          pageTitle="LTFan"
          pageDescription="LTFan's home page"
          topBarTitle="LTFan"
        />
      )}

      <Container>
        <Box sx={{ my: 2 }}>
          <Component {...pageProps} LT={AV} />
        </Box>
      </Container>

      <footer>
        <Box
          sx={{
            p: 5,
            width: 1,
          }}
        >
          <Box
            sx={{
              mx: 'auto',
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.mode === 'light'
                    ? theme.palette.common.black
                    : theme.palette.common.white,
                  0.5
                ),
            }}
          >
            <Typography component="span">
              Powered by{' '}
              <a
                href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledImage
                  src={vercel}
                  alt="Vercel Logo"
                  width={72}
                  height={16}
                />
              </a>
            </Typography>
          </Box>
        </Box>
      </footer>
    </ThemeProvider>
  );
};

export default App;
