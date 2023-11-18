import Image from "next/image";
import type { AppProps } from "next/app";
import { useMemo } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  styled,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import AppHead from "../components/page/head";

export default function MyApp({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  const StyledImage = styled(Image)(({ theme }) => ({
    filter: `invert(${theme.palette.mode === "light" ? "0%" : "100%"})`,
  }));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {pageProps.head && (
        <AppHead
          pageTitle={pageProps.head.pageTitle}
          pageDescription={pageProps.head.pageDescription}
          topBarTitle={pageProps.head.topBarTitle}
        />
      )}

      <Container>
        <Box sx={{ my: 2 }}>
          <Component {...pageProps} />

          <footer>
            <Container>
              <a
                href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Powered by{" "}
                <span>
                  <StyledImage
                    src="/vercel.svg"
                    alt="Vercel Logo"
                    width={72}
                    height={16}
                  />
                </span>
              </a>
            </Container>
          </footer>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
