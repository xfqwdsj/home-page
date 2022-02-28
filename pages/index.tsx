import { Button, Grid, SvgIconTypeMap, Typography } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import type { NextPage } from 'next';
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

interface HomeApps {
  name: string
  icon : OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
}

}

const Home: NextPage = () => {
  return (
    <>
      <Typography variant="h1">LTFan 的大杂烩</Typography>
      <Grid spacing={2}>
        <Grid item>

        </Grid>
      </Grid>
      <Button component={NextLinkComposed} to="clash/" variant="contained">
        去 Clash
      </Button>
    </>
  );
};

export default Home;
