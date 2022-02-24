import { Button } from '@mui/material';
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

const Home: NextPage = () => {
  return (
    <>
      <Button component={NextLinkComposed} to="clash/" variant="contained">
        去 Clash
      </Button>
    </>
  );
};

export default Home;
