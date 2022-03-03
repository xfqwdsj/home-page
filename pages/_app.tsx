import Image from "next/image";
import type {AppProps} from "next/app";
import {
    Dispatch,
    MouseEventHandler,
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
    Button,
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
import {nanoid} from "nanoid";

export type LeanAV = typeof AV;

type AlertDialogButton = {
    content: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    autoFocus?: boolean;
    id?: string;
};

export type AppAlertDialogController = {
    setTitle: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
    setButtons: Dispatch<SetStateAction<AlertDialogButton[]>>;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export type AppHeaderController = {
    setPageTitle: Dispatch<SetStateAction<string>>;
    setPageDescription: Dispatch<SetStateAction<string>>;
    setTopBarTitle: Dispatch<SetStateAction<string>>;
};

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
    const [dialogMessage, changeDialogMessage] = useState("");
    const [dialogButtons, changeDialogButtons] = useState<AlertDialogButton[]>(
        []
    );
    const [isDialogOpen, changeDialogOpen] = useState(false);

    const GlobalAlertDialog: AppAlertDialogController = {
        setTitle: changeDialogTitle,
        setMessage: changeDialogMessage,
        setButtons: changeDialogButtons,
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
                    onClose={() => changeDialogOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {dialogTitle}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {dialogMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {dialogButtons.map((button) => {
                            const defaultButton = {
                                autoFocus: false,
                                id: nanoid(),
                            };
                            const {content, onClick, autoFocus, id} = {
                                ...defaultButton,
                                ...button,
                            };
                            return (
                                <Button
                                    onClick={onClick}
                                    autoFocus={autoFocus}
                                    key={id}
                                >
                                    {content}
                                </Button>
                            );
                        })}
                    </DialogActions>
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
