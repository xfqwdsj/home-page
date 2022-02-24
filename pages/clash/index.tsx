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
import { User, Error as AVError } from 'leancloud-storage';
import type { NextPage } from 'next';
import { useState } from 'react';
import { HeadProps } from '../../components/page/head';

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
  name: string,
  pswd: string
): Promise<Array<string> | AVError> => {
  return await User.logIn(name, pswd)
    .then((user) => {
      return user.get('group') as Array<string> | null | undefined;
    })
    .then((result) => {
      User.logOut();
      return result ? result : [];
    })
    .catch((e: AVError) => {
      return e;
    });
};

const Clash: NextPage = () => {
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
    setMsge('');
  };

  return (
    <Container>
      <Paper>
        <Grid container spacing={1}>
          <Grid container item spacing={1}>
            <TextField
              fullWidth
              label="用户名"
              type="text"
              autoComplete="username"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </Grid>
          <Grid container item spacing={1}>
            <TextField
              fullWidth
              label="密码"
              type="password"
              autoComplete="password"
              value={pswd}
              onChange={(event) => {
                setPswd(event.target.value);
              }}
            />
          </Grid>
          <Grid container item spacing={1}>
            <Button
              variant="contained"
              onClick={() => {
                close();
                query(name, pswd).then((result) => {
                  if (Array.isArray(result)) {
                    paper(`你的组为${result}`);
                  } else {
                    paper(JSON.stringify(result));
                  }
                });
              }}
            >
              查询
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                close();
                const user = new User();
                user.setUsername(name);
                user.setPassword(pswd);
                user.signUp().then(
                  () => {
                    dialog('注册成功');
                    User.logOut();
                  },
                  (e: AVError) => {
                    dialog(JSON.stringify(e));
                  }
                );
              }}
            >
              注册
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Collapse in={open === 1}>
        <Typography variant="body1">{msge}</Typography>
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
