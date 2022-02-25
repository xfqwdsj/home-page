import {
  Button,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import AV, { ACL } from 'leancloud-storage';
//import { Adapters } from '@leancloud/adapter-types';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { HeadProps } from '../../components/page/head';

//const { User } = AV;

const head: HeadProps = {
  pageTitle: 'Clash | LTFan',
  pageDescription: "LTFan's Clash configs console.",
  topBarTitle: 'Clash',
};

export const getStaticProps = () => {
  return {
    props: {
      head: head,
    },
  };
};

const query = async (
  AC: typeof AV,
  name: string,
  pswd: string
): Promise<Array<string> | AV.Error> => {
  return await AC.User.logIn(name, pswd)
    .then((user) => {
      return user.get('group') as Array<string> | null | undefined;
    })
    .then((result) => {
      AC.User.logOut();
      return result ? result : [];
    })
    .catch((e: AV.Error) => {
      return e;
    });
};

const Clash = ({ AC }: { AC: typeof AV }) => {
  const [name, setName] = useState(''); // Name
  const [pswd, setPswd] = useState(''); // Password
  const [open, setOpen] = useState<number | null>(null); // Open (1: Collapse, 2: Dialog)
  const [msge, setMsge] = useState(''); // Message

  const paper = (msg: string) => {
    setMsge(msg);
    setOpen(1);
  };

  const dialog = (msg: string) => {
    setMsge(msg);
    setOpen(2);
  };

  const close = () => {
    setOpen(null);
  };

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid container item spacing={1} justifyContent="center">
          <Grid item xs>
            <TextField
              label="用户名"
              type="text"
              autoComplete="username"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Grid container item spacing={1} justifyContent="center">
          <Grid item xs>
            <TextField
              label="密码"
              type="password"
              autoComplete="password"
              value={pswd}
              onChange={(event) => {
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
                close();
                query(AC, name, pswd).then((result) => {
                  if (Array.isArray(result)) {
                    paper(`你的组为${result}`);
                  } else {
                    paper(result.message);
                  }
                });
              }}
            >
              查询
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => {
                close();
                const user = new AC.User();
                user.setUsername(name);
                user.setPassword(pswd);
                user.signUp().then(
                  () => {
                    dialog('注册成功');
                    AC.User.logOut();
                  },
                  (e: AV.Error) => {
                    dialog(e.message);
                  }
                );
              }}
            >
              注册
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Collapse in={open === 1}>
        <Container
          sx={{
            p: 2,
          }}
        >
          <Typography variant="body1">{msge}</Typography>
        </Container>
      </Collapse>
      <Dialog
        open={open === 2}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>注册结果</DialogTitle>
        <DialogContent>
          <DialogContentText>{msge}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} autoFocus>
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Clash;
