import Image from 'next/image';
import type { AppProps } from 'next/app';
import { useMemo } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  styled,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import AppHead from '../components/page/head';

export default function MyApp({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: prefersDarkMode ? '#ffffff1a' : '#0000001a',
          },
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  const StyledImage = styled(Image)(({ theme }) => ({
    filter: `invert(${theme.palette.mode === 'light' ? '0%' : '100%'})`,
  }));

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
          <Component {...pageProps} />
        </Box>
      </Container>

      <footer>
        <Container sx={{ py: 5, position: 'relative' }}>
          <Box
            sx={(theme) => ({
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              backgroundColor:
                theme.palette.mode === 'light'
                  ? theme.palette.common.black
                  : theme.palette.common.white,
              opacity: '5%',
              zIndex: -1,
            })}
          />
          <Box
            sx={{ width: 'max-content', mx: 'auto', verticalAlign: 'middle' }}
          >
            <span>
              Powered by{' '}
              <a
                href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledImage
                  src="/vercel.svg"
                  alt="Vercel Logo"
                  width={72}
                  height={16}
                />
              </a>
            </span>
          </Box>
        </Container>
      </footer>
    </ThemeProvider>
  );
}
