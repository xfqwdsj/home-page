import {GetStaticProps, NextPage} from "next";
import {HeadProps} from "../../../components/head";
import {CardInfo, MasonryCards} from "../../../components/masonry_cards";
import NearMeIcon from "@mui/icons-material/NearMe";

const head: HeadProps = {
    pageTitle: "五子棋 | 游戏 | LTFan",
    pageDescription: "Some games.",
    topBarTitle: "选择模式 | 五子棋",
};

export const getStaticProps: GetStaticProps = () => ({
    props: {
        head,
    },
});

const cards: CardInfo[] = [{
    name: "面对面",
    icon: NearMeIcon,
    description: "邀请身边的朋友面对面进行游戏",
    href: "/games/gobang/nearby",
}];

const Gobang: NextPage = () => {
    return (
        <>
            <MasonryCards cards={cards}/>
        </>
    );
};

export default Gobang;
