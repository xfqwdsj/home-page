import {HeadProps} from "../../../components/head";
import {GetStaticProps, NextPage} from "next";
import Gobang, {GobangBoard} from "../../../components/gobang/gobang";
import {useState} from "react";

const head: HeadProps = {
    pageTitle: "五子棋 | 在 LTFan 上面对面进行的游戏",
    pageDescription: "Would you like to try it on?",
    topBarTitle: "胡乱游戏 | 五子棋",
};

export const getStaticProps: GetStaticProps = () => ({
    props: {
        head,
    },
});

const FxxksGobang: NextPage = () => {
    const [board, changeBoard] = useState<GobangBoard>(
        [
            [null,      "black",    undefined,  null],
            ["white",   null,       null,       undefined],
            [undefined, null,       null,       "white"]
        ]
    );

    return (
        <>
            <Gobang board={board} onBoardStateChange={(value) => changeBoard(value)}/>
        </>
    );
};

export default FxxksGobang;
