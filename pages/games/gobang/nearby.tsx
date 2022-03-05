import {HeadProps} from "../../../components/head";
import {GetStaticProps, NextPage} from "next";
import Gobang, {GobangBoard, Player} from "../../../components/gobang/gobang";
import {MutableRefObject, Reducer, useReducer, useRef, useState} from "react";
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
    {board: GobangBoard},
    {
        dialog: AppDialogController;
        header: AppHeaderController;
        nextPlayer: MutableRefObject<Player | null>;
        x: number;
        y: number;
    }
> = ({board}, {dialog, header, nextPlayer, x, y}) => {
    if (
        board[x].array[y].point === "normal" ||
        board[x].array[y].point === "main"
    ) {
        if (nextPlayer.current === null) return {board};
        const tmp = [...board];
        tmp[x].array[y].point = nextPlayer.current;
        const winner = getWinner(board, x, y);
        if (winner) {
            nextPlayer.current = null;
            const onCancel = () => dialog.setOpen(false);
            header.setTopBarTitle(
                `赢家：${nextPlayer.current} | ${head.topBarTitle}`
            );
            dialog.setTitle("赢了！");
            dialog.setContent(<>{`恭喜：${winner}`}</>);
            dialog.setActions(<Button onClick={onCancel}>确定</Button>);
            dialog.setOnCancel(() => onCancel);
            dialog.setOpen(true);
        } else {
            nextPlayer.current =
                nextPlayer.current === "black" ? "white" : "black";
            header.setTopBarTitle(
                `下一步：${nextPlayer.current} | ${head.topBarTitle}`
            );
        }
        return {board: tmp};
    }
    return {board};
};

const NearbyGobang: NextPage<{
    header: AppHeaderController;
    dialog: AppDialogController;
}> = ({header, dialog}) => {
    const [{board}, dispatchState] = useReducer(doOnPointClick, {
        board: defaultBoard(),
    });
    const [size, setSize] = useState(50);
    const nextPlayer = useRef<Player>("black");

    return (
        <>
            <Gobang
                board={board}
                onPointClick={(x, y) =>
                    dispatchState({header, dialog, nextPlayer, x, y})
                }
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
