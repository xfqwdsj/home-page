import {HeadProps} from "../../../components/head";
import {GetStaticProps, NextPage} from "next";
import Gobang, {
    GobangBoard,
    Player,
    PointTypes,
} from "../../../components/gobang/gobang";
import {Reducer, useCallback, useReducer, useState} from "react";
import {Box, Slider, Typography} from "@mui/material";
import {nanoid} from "nanoid";
import {AppAlertDialog} from "../../_app";

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

const defaultBoard = (): GobangBoard => {
    const mainPoints = [
        [3, 3],
        [3, 11],
        [14, 14],
        [11, 3],
        [11, 11],
    ];
    return Array.from({length: 15}, (_, x) => ({
        array: Array.from({length: 15}, (_, y) => {
            let point: PointTypes = "normal";
            mainPoints.forEach((p, i) => {
                if (x === p[0] && y === p[1]) {
                    point = "main";
                    mainPoints.splice(i, 1);
                }
            });
            return {point: point, id: nanoid()};
        }),
        id: nanoid(),
    }));
};

const getWinner = (board: GobangBoard, row: number, column: number) => {
    const player = board[row].array[column].point;
    if (player) {
        let tmp = 0;
        const go = (i: number, r: number, c: number) => {
            switch (i) {
                case 1:
                    return [r, c - 1];
                case 2:
                    return [r, c + 1];
                case 3:
                    return [r - 1, c];
                case 4:
                    return [r + 1, c];
                case 5:
                    return [r + 1, c - 1];
                case 6:
                    return [r - 1, c + 1];
                case 7:
                    return [r - 1, c - 1];
                case 8:
                    return [r + 1, c + 1];
                default:
                    return [0, 0];
            }
        };
        for (let i = 1; i <= 8; i++) {
            if (i % 2 === 1) {
                tmp = 0;
            } else {
                tmp--;
            }
            (function calc(r: number, c: number) {
                if (
                    board[r] &&
                    board[r].array[c] &&
                    board[r].array[c].point === player
                ) {
                    tmp++;
                    const params = go(i, r, c);
                    calc(params[0], params[1]);
                }
            })(row, column);
            if (tmp >= 5) return player;
        }
        return undefined;
    }
};

const doOnPointClick: Reducer<
    {board: GobangBoard; player: Player},
    {dialog: AppAlertDialog; x: number; y: number}
> = ({board, player}, {dialog, x, y}) => {
    if (
        board[x].array[y].point === "normal" ||
        board[x].array[y].point === "main"
    ) {
        const tmp = [...board];
        tmp[x].array[y].point = player;
        const winner = getWinner(board, x, y);
        if (winner) {
            dialog.setTitle("赢了！");
            dialog.setMessage(`恭喜：${winner}`);
            dialog.setButtons([
                {
                    content: "确定",
                    onClick: () => dialog.setOpen(false),
                    autoFocus: true,
                },
            ]);
            dialog.setOpen(true);
        }
        return {board: tmp, player: player === "black" ? "white" : "black"};
    }
    return {board, player};
};

const NearbyGobang: NextPage<{dialog: AppAlertDialog}> = ({dialog}) => {
    const [{board, player}, dispatchState] = useReducer(doOnPointClick, {
        board: defaultBoard(),
        player: "black",
    });
    const [size, setSize] = useState(100);

    return (
        <>
            <Box width="max-content" mx="auto">
                <Typography component="span">下一步：{player}</Typography>
            </Box>
            <Gobang
                board={board}
                onPointClick={(x, y) => dispatchState({dialog, x, y})}
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

export default NearbyGobang;
