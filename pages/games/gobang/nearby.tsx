import {HeadProps} from "../../../components/head";
import {GetStaticProps, NextPage} from "next";
import Gobang, {GobangBoard} from "../../../components/gobang/gobang";
import {useState} from "react";

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
    const [board, changeBoard] = useState<GobangBoard>([[null, "black", undefined], ["white", null, null], [undefined, null, null]]);

    return (
        <>
            <Gobang board={board} onBoardStateChange={(value) => changeBoard(value)}/>
        </>
    );
};

export default NearbyGobang;
