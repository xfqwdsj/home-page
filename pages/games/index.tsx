import { NextPage } from 'next';
import { GobangIcon } from '../../components/icons';
import { MasonryCards } from '../../components/masonryCards';
import { HeadProps } from '../../components/page/head';

const head: HeadProps = {
  pageTitle: '游戏 | LTFan',
  pageDescription: 'Some games.',
  topBarTitle: '游戏',
};

export const getStaticProps = () => {
  return {
    props: {
      head: head,
    },
  };
};

const cards = [
  {
    name: '五子棋',
    icon: GobangIcon,
    description: '最多两人的对战游戏',
    href: 'gobang/',
  },
];

const Games: NextPage = () => {
  return (
    <>
      <MasonryCards cards={cards} />
    </>
  );
};

export default Games;
