import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  SvgIconTypeMap,
  Typography,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import type { NextPage } from 'next';
import { UrlObject } from 'url';
import { ClashIcon } from '../components/icons/clash';
import GamesIcon from '@mui/icons-material/Games';
import BugReportIcon from '@mui/icons-material/BugReport';
import { NextLinkComposed } from '../components/link';
import { HeadProps } from '../components/page/head';

const head: HeadProps = {
  pageTitle: 'LTFan',
  pageDescription: "LTFan's home page",
  topBarTitle: 'LTFan',
};

export const getStaticProps = () => {
  return {
    props: {
      head: head,
    },
  };
};

interface HomeApp {
  name: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  };
  viewBox?: string;
  description: string;
  href: string | UrlObject;
}

const apps: HomeApp[] = [
  {
    name: 'Clash',
    icon: ClashIcon,
    viewBox: '0 0 512 512',
    description: 'Clash 配置多用户托管服务',
    href: 'clash/',
  },
  {
    name: '游戏',
    icon: GamesIcon,
    description: '适合网页游玩的小游戏',
    href: 'games/',
  },
  {
    name: '测试',
    icon: BugReportIcon,
    description: '测试页面，你永远想不到我会在里面放些什么',
    href: 'test/',
  },
];

const Home: NextPage = () => {
  return (
    <>
      <Grid container spacing={2}>
        {apps.map((app) => (
          <Grid key={app.toString()} item xs>
            <Card sx={{ mx: 'auto', width: 275 }}>
              <CardContent>
                <app.icon sx={{ width: 1, height: 80 }} viewBox={app.viewBox} />
                <Typography variant="h5">{app.name}</Typography>
                <Typography color="text.secondary">
                  {app.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={NextLinkComposed} to={app.href}>
                  去看看
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Home;
