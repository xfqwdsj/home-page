import Image from "next/image";
import type {AppProps} from "next/app";
import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
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
import AppHead, {HeadProps} from "../components/head";
import AV from "leancloud-storage/core";
import {Adapters} from "@leancloud/adapter-types";
import vercel from "../public/vercel.svg";
import {initializeApp, FirebaseApp} from "firebase/app";
import {getAnalytics, Analytics} from "firebase/analytics";
import {getDatabase, Database} from "firebase/database";

export type LeanAV = typeof AV;

export type AppDialogController = {
    setTitle: Dispatch<SetStateAction<string>>;
    setContent: Dispatch<SetStateAction<JSX.Element>>;
    setActions: Dispatch<SetStateAction<JSX.Element>>;
    setOnCancel: Dispatch<SetStateAction<() => void>>;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export type AppHeaderController = {
    setPageTitle: Dispatch<SetStateAction<string>>;
    setPageDescription: Dispatch<SetStateAction<string>>;
    setTopBarTitle: Dispatch<SetStateAction<string>>;
};

export let firebaseApp: FirebaseApp;
export let firebaseAnalytics: Analytics;
export let firebaseDatabase: Database;

const App = ({Component, pageProps}: AppProps<{head?: HeadProps}>) => {
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

    const StyledImage = styled(Image)(({theme}) => ({
        filter: `invert(${theme.palette.mode === "light" ? "0%" : "100%"})`,
    }));

    const [dialogTitle, changeDialogTitle] = useState("");
    const [dialogContent, changeDialogContent] = useState(<></>);
    const [dialogActions, changeDialogActions] = useState(<></>);
    const [dialogOnCancel, changeDialogOnCancel] = useState(() => () => {});
    const [isDialogOpen, changeDialogOpen] = useState(false);

    const GlobalAlertDialog: AppDialogController = {
        setTitle: changeDialogTitle,
        setContent: changeDialogContent,
        setActions: changeDialogActions,
        setOnCancel: changeDialogOnCancel,
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
            const adapter = await import(
                "@leancloud/platform-adapters-browser"
            );
            AV.setAdapters(adapter as unknown as Adapters);
            AV.init({
                appId: "nSOTaTjLRFryFL00StQsb3lS-MdYXbMMI",
                appKey: "3zBz5tMkTpEdoFCnQ7Xqxx65",
            });
        })();
    }, []);

    useEffect(() => {
        const firebaseConfig = {
            apiKey: process.env.apiKey,
            authDomain: process.env.authDomain,
            databaseURL: process.env.databaseURL,
            projectId: process.env.projectId,
            storageBucket: process.env.storageBucket,
            messagingSenderId: process.env.messagingSenderId,
            appId: process.env.appId,
            measurementId: process.env.measurementId,
        };
        firebaseApp = initializeApp(firebaseConfig);
        firebaseAnalytics = getAnalytics(firebaseApp);
        firebaseDatabase = getDatabase(firebaseApp);
    }, []);

    useEffect(() => {
        changeHeadPageTitle(
            pageProps.head ? pageProps.head.pageTitle : "LTFan"
        );
        changeHeadPageDescription(
            pageProps.head
                ? pageProps.head.pageDescription
                : "LTFan's home page."
        );
        changeTopBarTitle(
            pageProps.head ? pageProps.head.topBarTitle : "LTFan"
        );
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
                        LT={AV}
                        header={GlobalHeader}
                        dialog={GlobalAlertDialog}
                    />
                </Box>
                <Dialog
                    open={isDialogOpen}
                    onClose={dialogOnCancel}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {dialogTitle}
                    </DialogTitle>
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
