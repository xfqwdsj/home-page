import {GetStaticProps, NextPage} from "next";
import {GobangIcon} from "../../components/icons";
import {CardInfo, CardsGrid} from "../../components/cards_grid";
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
            <CardsGrid cards={cards}/>
        </>
    );
};

export default Games;
