import {HeadProps} from "../../../components/head";
import {GetStaticProps, NextPage} from "next";
import Gobang, {GobangBoard, Player} from "../../../components/gobang/gobang";
import {Reducer, useEffect, useReducer, useState} from "react";
import {Button, Slider} from "@mui/material";
import {AppDialogController, AppHeaderController} from "../../_app";
import {
    defaultBoard,
    getWinner,
} from "../../../components/gobang/fifteenFifteenFive";
import {ref, set, onValue} from "firebase/database";
import {firebaseDatabase} from "../../../components/firebase";

const head: HeadProps = {
    pageTitle: "五子棋 | 在 LTFan 上面对面进行的游戏",
    pageDescription: "Would you like to try it on?",
    topBarTitle: "在线游戏 | 五子棋",
};

export const getStaticProps: GetStaticProps = () => ({
    props: {
        head,
    },
});

const calculateState: Reducer<
    {board: GobangBoard; player: Player; me: Player},
    | {
          type: "updateBoard";
          dialog: AppDialogController;
          header: AppHeaderController;
          x: number;
          y: number;
      }
    | {
          type: "init";
          player: Player;
      }
> = ({board, player, me}, action) => {
    switch (action.type) {
        case "updateBoard":
            const {dialog, header, x, y} = action;
            if (
                x !== undefined &&
                y !== undefined &&
                (board[x].array[y].point === "normal" ||
                    board[x].array[y].point === "main")
            ) {
                const tmp = [...board];
                const nextPlayer = player === "black" ? "white" : "black";
                tmp[x].array[y].point = player;
                header.setTopBarTitle(
                    `下一步：${nextPlayer} | ${head.topBarTitle}`
                );
                const winner = getWinner(board, x, y);
                if (winner) {
                    const onCancel = () => dialog.setOpen(false);
                    dialog.setTitle("赢了！");
                    dialog.setContent(<>{`恭喜：${winner}`}</>);
                    dialog.setActions(<Button onClick={onCancel}>确定</Button>);
                    dialog.setOnCancel(onCancel);
                    dialog.setOpen(true);
                }
                return {board: tmp, player: nextPlayer, me};
            }
            break;
        case "init":
            return {board: defaultBoard(), player: "black", me: action.player};
    }
    return {board, player, me};
};

const OnlineGobang: NextPage<{
    header: AppHeaderController;
    dialog: AppDialogController;
}> = ({header, dialog}) => {
    const [{board}, dispatchState] = useReducer(calculateState, {
        board: defaultBoard(),
        player: "black",
        me: "black",
    });
    const [size, setSize] = useState(50);

    useEffect(() => {
        const refData = ref(firebaseDatabase, "/rooms/a");
        onValue(refData, (snapshot) => {
            const val = snapshot.val() as {x: number; y: number} | null;
            if (val) {
                dispatchState({
                    type: "updateBoard",
                    dialog,
                    header,
                    x: val.x,
                    y: val.y,
                });
            } else {
                set(refData, {
                    x: 2,
                    y: 2,
                });
            }
        });
    }, []);

    return (
        <>
            <Gobang
                board={board}
                onPointClick={(x, y) =>
                    dispatchState({type: "updateBoard", header, dialog, x, y})
                }
                size={size}
            />
            <Slider
                aria-label="Board Size"
                min={40}
                max={100}
                value={size}
                onChange={(_, newValue) => setSize(newValue as number)}
                valueLabelDisplay="auto"
            />
        </>
    );
};

export default OnlineGobang;
