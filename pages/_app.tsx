import Image from "next/image";
import type { AppProps } from "next/app";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  alpha,
  Box,
  Container,
  createTheme,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AppHead, { HeadProps } from "../components/head";
import vercel from "../public/vercel.svg";
import { initFirebaseAppCheck } from "../components/firebase";
import AV from "../components/leancloud";

export type AppDialogController = {
  setDialog: (
    title: ReactNode,
    content: ReactNode,
    actions: ReactNode,
    onClose: () => void
  ) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export type AppHeaderController = {
  setPageTitle: Dispatch<SetStateAction<string>>;
  setPageDescription: Dispatch<SetStateAction<string>>;
  setTopBarTitle: Dispatch<SetStateAction<string>>;
};

const App = ({ Component, pageProps }: AppProps<{ head?: HeadProps }>) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createTheme({
        components: {
          MuiTypography: {
            styleOverrides: {
              root: {
                wordWrap: "break-word",
              },
            },
          },
          MuiBackdrop: {
            styleOverrides: {
              root: {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(5px)",
              },
            },
          },
        },
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  const StyledImage = styled(Image)(({ theme }) => ({
    filter: `invert(${theme.palette.mode === "light" ? "0%" : "100%"})`,
  }));

  const [dialogTitle, changeDialogTitle] = useState<ReactNode>(<></>);
  const [dialogContent, changeDialogContent] = useState<ReactNode>(<></>);
  const [dialogActions, changeDialogActions] = useState<ReactNode>(<></>);
  const [dialogOnClose, changeDialogOnClose] = useState(() => () => {});
  const [isDialogOpen, changeDialogOpen] = useState(false);

  const GlobalAlertDialog: AppDialogController = {
    setDialog: (
      title: ReactNode,
      content: ReactNode,
      actions: ReactNode,
      onClose: () => void
    ) => {
      changeDialogTitle(title);
      changeDialogContent(content);
      changeDialogActions(actions);
      changeDialogOnClose(() => onClose);
    },
    setOpen: changeDialogOpen,
  };

  const [headPageTitle, changeHeadPageTitle] = useState(
    pageProps.head ? pageProps.head.pageTitle : "LTFan"
  );
  const [headPageDescription, changeHeadPageDescription] = useState(
    pageProps.head ? pageProps.head.pageDescription : "LTFan's home page."
  );
  const [topBarTitle, changeTopBarTitle] = useState(
    pageProps.head ? pageProps.head.topBarTitle : "LTFan"
  );

  const GlobalHeader: AppHeaderController = {
    setPageTitle: changeHeadPageTitle,
    setPageDescription: changeHeadPageDescription,
    setTopBarTitle: changeTopBarTitle,
  };

  useEffect(() => {
    (async () => {
      const adapters = await import("@leancloud/platform-adapters-browser");
      AV.setAdapters(adapters);
      AV.init({
        appId: "oGcy9vKWCexf8bMi2jBtyziu-MdYXbMMI",
        appKey: "SFcECqIUlHq4iPpMy2DpjxbY",
      });
    })();
  }, []);

  useEffect(() => {
    initFirebaseAppCheck();
  }, []);

  useEffect(() => {
    changeHeadPageTitle(pageProps.head ? pageProps.head.pageTitle : "LTFan");
    changeHeadPageDescription(
      pageProps.head ? pageProps.head.pageDescription : "LTFan's home page."
    );
    changeTopBarTitle(pageProps.head ? pageProps.head.topBarTitle : "LTFan");
  }, [pageProps.head]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppHead
        pageTitle={headPageTitle}
        pageDescription={headPageDescription}
        topBarTitle={topBarTitle}
      />

      <Container>
        <Box my={2}>
          <Component
            {...pageProps}
            header={GlobalHeader}
            dialog={GlobalAlertDialog}
          />
        </Box>
        <Dialog
          open={isDialogOpen}
          onClose={dialogOnClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dialogContent}
            </DialogContentText>
          </DialogContent>
          <DialogActions>{dialogActions}</DialogActions>
        </Dialog>
      </Container>

      <footer>
        <Box
          width={1}
          p={5}
          sx={{
            backgroundColor: (theme) =>
              alpha(
                theme.palette.mode === "light"
                  ? theme.palette.common.black
                  : theme.palette.common.white,
                0.05
              ),
          }}
        >
          <Box width="max-content" mx="auto">
            <Typography component="span">
              Powered by{" "}
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
