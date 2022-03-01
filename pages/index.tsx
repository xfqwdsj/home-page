import type {NextPage} from "next";
import {ClashIcon} from "../components/icons";
import GamesIcon from "@mui/icons-material/Games";
import BugReportIcon from "@mui/icons-material/BugReport";
import {HeadProps} from "../components/page/head";
import {MasonryCards} from "../components/masonryCards";

const head: HeadProps = {
    pageTitle: "LTFan",
    pageDescription: "LTFan's home page",
    topBarTitle: "LTFan",
};

export const getStaticProps = () => ({
    props: {
        head,
    },
});

const cards = [
    {
        name: "Clash",
        icon: ClashIcon,
        description: "Clash 配置多用户托管服务",
        href: "clash/",
    },
    {
        name: "游戏",
        icon: GamesIcon,
        description: "适合网页游玩的小游戏",
        href: "games/",
    },
    {
        name: "测试",
        icon: BugReportIcon,
        description: "测试页面，你永远想不到我会在里面放些什么",
        href: "test/",
    },
];

const Home: NextPage = () => {
    return (
        <>
            <MasonryCards cards={cards}/>
        </>
    );
};

export default Home;
