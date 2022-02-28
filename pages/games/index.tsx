import { NextPage } from 'next';
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

const Games: NextPage = () => {
  return <>
  
  </>;
};

export default Games;
