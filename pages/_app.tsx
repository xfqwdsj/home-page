import Image from "next/image";
import type {AppProps} from "next/app";
import {Dispatch, MouseEventHandler, SetStateAction, useEffect, useMemo, useState} from "react";
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
import AppHead from "../components/head";
import AV from "leancloud-storage/core";
import {Adapters} from "@leancloud/adapter-types";
import vercel from "../public/vercel.svg";
import {nanoid} from "nanoid";

type AlertDialogButton = {
    content: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    autoFocus?: boolean;
    id?: string;
};

export type AppAlertDialog = {
    setTitle: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
    setButtons: Dispatch<SetStateAction<AlertDialogButton[]>>;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

const App = ({Component, pageProps}: AppProps) => {
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

    const [title, changeTitle] = useState("");
    const [message, changeMessage] = useState("");
    const [buttons, changeButtons] = useState<AlertDialogButton[]>([]);
    const [open, changeOpen] = useState(false);

    const GlobalAlertDialog: AppAlertDialog = {
        setTitle: changeTitle,
        setMessage: changeMessage,
        setButtons: changeButtons,
        setOpen: changeOpen,
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
                <Box my={2}>
                    <Component
                        {...pageProps}
                        LT={AV}
                        dialog={GlobalAlertDialog}
                    />
                </Box>
                <Dialog
                    open={open}
                    onClose={() => changeOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {buttons.map((button) => {
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
