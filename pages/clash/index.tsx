import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Link,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import {useEffect, useState} from "react";
import {NextLinkComposed} from "../../components/link";
import {HeadProps} from "../../components/head";
import {parseRoles} from "../../components/user";
import {Adapters} from "@leancloud/adapter-types";
import {GetStaticProps, NextPage} from "next";
import AV from "../../components/leancloud";

const head: HeadProps = {
    pageTitle: "Clash | LTFan",
    pageDescription: "LTFan's Clash configs console.",
    topBarTitle: "Clash",
};

export const getStaticProps: GetStaticProps = () => ({
    props: {
        head,
    },
});

interface QueryResult {
    roles: Array<string>;
    rules: Array<string>;
}

const query = async (
    name: string,
    pswd: string,
): Promise<QueryResult | string> => {
    try {
        const roles = await parseRoles(AV.User.logIn(name, pswd));
        const rules = (await new AV.Query("Rules").find()).map(
            (rule) => rule.get("name") as string,
        );
        AV.User.logOut();
        return {roles, rules};
    } catch (e) {
        return (e as Error).message;
    }
};

const Clash: NextPage = () => {
    const [name, setName] = useState(""); // Name
    const [pswd, setPswd] = useState(""); // Password
    const [open, setOpen] = useState(false); // Open
    const [tite, setTite] = useState(""); // Title
    const [msge, setMsge] = useState(""); // Message
    const [cont, setCont] = useState(<></>); // Additional content
    const [ruls, setRuls] = useState(new Array<string>()); // Rules
    const [rule, setRule] = useState("none"); // Current rule

    const dialog = (
        title: string,
        msg: string,
        content?: JSX.Element | undefined,
    ) => {
        setTite(title);
        setMsge(msg);
        setCont(content ? content : <></>);
        setOpen(true);
    };

    const close = () => {
        setOpen(false);
    };

    const clear = () => {
        setRuls([]);
        setRule("none");
    };

    return (
        <>
            <Grid container spacing={1}>
                <Grid container item spacing={1} justifyContent="center">
                    <Grid item>
                        <TextField
                            label="?????????"
                            type="text"
                            autoComplete="username"
                            value={name}
                            onChange={(event) => {
                                clear();
                                setName(event.target.value);
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container item spacing={1} justifyContent="center">
                    <Grid item>
                        <TextField
                            label="??????"
                            type="password"
                            autoComplete="password"
                            value={pswd}
                            onChange={(event) => {
                                clear();
                                setPswd(event.target.value);
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container item spacing={1} justifyContent="center">
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={() => {
                                query(name, pswd).then((result) => {
                                    if (typeof result === "string") {
                                        dialog("????????????", result);
                                    } else {
                                        setRuls(result.rules);
                                        dialog("????????????", `????????????${result.roles}`);
                                    }
                                });
                            }}
                        >
                            ??????
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={() => {
                                try {
                                    const user = new AV.User();
                                    user.setUsername(name);
                                    user.setPassword(pswd);
                                    user
                                        .signUp()
                                        .then(() => {
                                            dialog("????????????", "??????????????????");
                                            AV.User.logOut();
                                        })
                                        .catch((e) => {
                                            dialog("????????????", (e as Error).message);
                                        });
                                } catch (e) {
                                    dialog("????????????", (e as Error).message);
                                }
                            }}
                        >
                            ??????
                        </Button>
                    </Grid>
                </Grid>
                <Grid container item spacing={1} justifyContent="center">
                    <Grid item>
                        <FormControl>
                            <FormLabel id="radio-group-rules" sx={{mx: "auto"}}>
                                ??????
                            </FormLabel>
                            <RadioGroup
                                row
                                value={rule}
                                onChange={(event) => setRule(event.target.value)}
                                aria-labelledby="radio-group-rules"
                            >
                                <FormControlLabel value="none" control={<Radio/>} label="???"/>
                                {ruls.map((it) => (
                                    <FormControlLabel
                                        key={it}
                                        value={it}
                                        control={<Radio/>}
                                        label={it}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container item spacing={1} justifyContent="center">
                    <Grid item>
                        <Link
                            component={NextLinkComposed}
                            to={`/api/clash?n=${name}&p=${pswd}${
                                rule !== "none" ? `&r=${rule}` : ""
                            }`}
                        >
                            ????????????
                        </Link>
                    </Grid>
                </Grid>
            </Grid>
            <Dialog
                open={open}
                onClose={close}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{tite}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {msge}
                    </DialogContentText>
                    {cont}
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} autoFocus>
                        ??????
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Clash;
