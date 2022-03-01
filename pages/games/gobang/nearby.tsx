import {HeadProps} from "../../../components/head";
import {GetStaticProps, NextPage} from "next";
import Gobang from "../../../components/gobang/gobang";

const head: HeadProps = {
    pageTitle: "五子棋 | 在 LTFan 上面对面进行的游戏",
    pageDescription: "Would you like to try it on?",
    topBarTitle: "面对面游戏 | 五子棋",
};

export const getStaticProps: GetStaticProps = () => ({
    props: {
        head,
    },
});

const NearbyGobang: NextPage = () => {
    return (
        <>
            <Gobang board={[[null, null], [null, null, null], [undefined, null, null]]}  onBoardStateChange={(_) => {}}/>
        </>
    );
};

export default NearbyGobang;
