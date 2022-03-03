import {HeadProps} from "../../../components/head";
import {GetStaticProps, NextPage} from "next";
import Gobang, {GobangBoard, Player} from "../../../components/gobang/gobang";
import {Reducer, useReducer, useState} from "react";
import {Button, Slider} from "@mui/material";
import {AppDialogController, AppHeaderController} from "../../_app";
import {
    defaultBoard,
    getWinner,
} from "../../../components/gobang/fifteenFifteenFive";

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

const doOnPointClick: Reducer<
    {board: GobangBoard; player: Player},
    {
        dialog: AppDialogController;
        header: AppHeaderController;
        x: number;
        y: number;
    }
> = ({board, player}, {dialog, header, x, y}) => {
    if (
        board[x].array[y].point === "normal" ||
        board[x].array[y].point === "main"
    ) {
        const tmp = [...board];
        const nextPlayer = player === "black" ? "white" : "black";
        tmp[x].array[y].point = player;
        header.setTopBarTitle(`下一步：${nextPlayer} | ${head.topBarTitle}`);
        const winner = getWinner(board, x, y);
        if (winner) {
            const onCancel = () => dialog.setOpen(false);
            dialog.setTitle("赢了！");
            dialog.setContent(<>{`恭喜：${winner}`}</>);
            dialog.setActions(<Button onClick={onCancel}>确定</Button>);
            dialog.setOnCancel(onCancel);
            dialog.setOpen(true);
        }
        return {board: tmp, player: nextPlayer};
    }
    return {board, player};
};

const NearbyGobang: NextPage<{
    header: AppHeaderController;
    dialog: AppDialogController;
}> = ({header, dialog}) => {
    const [{board}, dispatchState] = useReducer(doOnPointClick, {
        board: defaultBoard(),
        player: "black",
    });
    const [size, setSize] = useState(50);

    return (
        <>
            <Gobang
                board={board}
                onPointClick={(x, y) => dispatchState({header, dialog, x, y})}
                size={size}
            />
            <Slider
                aria-label="Board Size"
                value={size}
                onChange={(_, newValue) => setSize(newValue as number)}
                valueLabelDisplay="auto"
            />
        </>
    );
};

export default NearbyGobang;
