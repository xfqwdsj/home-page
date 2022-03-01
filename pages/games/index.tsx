import {GetStaticProps, NextPage} from "next";
import {GobangIcon} from "../../components/icons";
import {CardInfo, MasonryCards} from "../../components/masonry_cards";
import {HeadProps} from "../../components/head";

const head: HeadProps = {
    pageTitle: "游戏 | LTFan",
    pageDescription: "Some games.",
    topBarTitle: "游戏",
};

export const getStaticProps: GetStaticProps = () => ({
    props: {
        head,
    },
});

const cards: CardInfo[] = [
    {
        name: "五子棋",
        icon: GobangIcon,
        description: "最多两人的对战游戏",
        href: "/games/gobang/",
    },
];

const Games: NextPage = () => {
    return (
        <>
            <MasonryCards cards={cards}/>
        </>
    );
};

export default Games;
