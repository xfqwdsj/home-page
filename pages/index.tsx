import type { NextPage } from 'next';
import { HeadProps } from '../components/page/head';

const head: HeadProps = {
  pageTitle: 'LTFan',
  pageDescription: "LTFan's home page",
  topBarTitle: 'LTFan',
};

export function getStaticProps() {
  return {
    props: {
      head: head,
    },
  };
}

const Home: NextPage = () => {
  return (
    <>
      
    </>
  );
};

export default Home;
