import {AppBar, createTheme, IconButton, Theme, ThemeProvider, Toolbar, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import Head from "next/head";
import {useRouter} from "next/router";
import HomeIcon from "@mui/icons-material/Home";
import {NextLinkComposed} from "./link";

export interface HeadProps {
    pageTitle: string;
    pageDescription: string;
    topBarTitle: string;
}

const AppHead = ({pageTitle, pageDescription, topBarTitle}: HeadProps) => {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription}/>
                <meta name="viewport" content="initial-scale=1, width=device-width"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <ThemeProvider
                theme={(theme: Theme) =>
                    createTheme({
                        ...theme,
                        palette: {
                            ...theme.palette,
                            primary: {
                                main:
                                    theme.palette.mode === "light" ? "#ffffff1a" : "#0000001a",
                            },
                        },
                    })
                }
            >
                <AppBar
                    position="fixed"
                    sx={{
                        boxShadow: 0,
                        borderBottom: 1,
                        borderColor: (theme) =>
                            theme.palette.mode === "light" ? grey[300] : grey[900],
                        backdropFilter: "blur(10px)",
                    }}
                    enableColorOnDark
                >
                    <Toolbar>
                        {router.pathname !== "/" && (
                            <IconButton
                                component={NextLinkComposed}
                                to="/"
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="home"
                                sx={{mr: 2}}
                            >
                                <HomeIcon/>
                            </IconButton>
                        )}
                        <Typography variant="h6" component="div">
                            {topBarTitle}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar/>
            </ThemeProvider>
        </>
    );
};

export default AppHead;
