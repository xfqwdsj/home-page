import {
  Button,
  Collapse,
  Container,
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
  Typography,
} from '@mui/material';
import AV from 'leancloud-storage';
import { useState } from 'react';
import { NextLinkComposed } from '../../components/link';
import { HeadProps } from '../../components/page/head';
import { parseRoles } from '../../components/user';

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

interface QueryResult {
  roles: Array<string>;
  rules: Array<string>;
}

const query = async (
  AC: typeof AV,
  name: string,
  pswd: string
): Promise<QueryResult | string> => {
  try {
    const roles = await parseRoles(AC.User.logIn(name, pswd));
    const rules = (await new AC.Query('Rules').find()).map(
      (rule) => rule.get('name') as string
    );
    AC.User.logOut();
    return { roles, rules };
  } catch (e) {
    return (e as Error).message;
  }
};

const Clash = ({ AC }: { AC: typeof AV }) => {
  const [name, setName] = useState(''); // Name
  const [pswd, setPswd] = useState(''); // Password
  const [open, setOpen] = useState<number | null>(null); // Open (1: Collapse, 2: Dialog)
  const [msge, setMsge] = useState(''); // Message
  const [ruls, setRuls] = useState(new Array<string>()); // Rules
  const [rule, setRule] = useState('none'); // Current rule

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
    setRuls([]);
    setRule('none');
  };

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid container item spacing={1} justifyContent="center">
          <Grid item>
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
          <Grid item>
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
            <FormControl>
              <FormLabel sx={{ mx: 'auto' }}>规则</FormLabel>
              <RadioGroup
                row
                value={rule}
                onChange={(event) => setRule(event.target.value)}
              >
                <>
                  <FormControlLabel
                    value="none"
                    control={<Radio />}
                    label="无"
                  />
                  {ruls.map((it) => (
                    <FormControlLabel
                      key={it}
                      value={it}
                      control={<Radio />}
                      label={it}
                    />
                  ))}
                </>
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container item spacing={1} justifyContent="center">
          <Grid item>
            <Link
              component={NextLinkComposed}
              to={`/api/clash?n=${name}&p=${pswd}${
                rule !== 'none' ? `&r=${rule}` : ''
              }`}
            >
              配置链接
            </Link>
          </Grid>
        </Grid>
        <Grid container item spacing={1} justifyContent="center">
          <Grid item xs></Grid>
        </Grid>
        <Grid container item spacing={1} justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              onClick={() => {
                close();
                query(AC, name, pswd).then((result) => {
                  if (typeof result === 'string') {
                    paper(result);
                  } else {
                    setRuls(result.rules);
                    paper(`你的组为${result.roles}`);
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
