import {GobangBoard, Player, PointTypes} from "./gobang";
import {nanoid} from "nanoid";
import {AppDialogController, AppHeaderController} from "../../pages/_app";
import {MutableRefObject} from "react";
import {Button} from "@mui/material";

export const defaultBoard = (): GobangBoard => {
    const mainPoints = [
        [3, 3],
        [3, 11],
        [7, 7],
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

export const getWinner = (board: GobangBoard, row: number, column: number) => {
    const player = board[row].array[column].point;
    if (player) {
        let tmp = 0;
        const next = (i: number, r: number, c: number) => {
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
            if (i % 2 === 1) tmp = 0;
            (function calc(r: number, c: number) {
                const [x, y] = next(i, r, c);
                if (
                    board[x] &&
                    board[x].array[y] &&
                    board[x].array[y].point === player
                ) {
                    tmp++;
                    calc(x, y);
                }
            })(row, column);
            if (tmp >= 4) return player;
        }
        return undefined;
    }
};

export const drop = (
    board: GobangBoard,
    x: number,
    y: number,
    nextPlayer: MutableRefObject<Player | null>,
    dialog: AppDialogController,
    header: AppHeaderController,
    topBarTitle: string
) => {
    if (
        board[x].array[y].point === "normal" ||
        board[x].array[y].point === "main"
    ) {
        if (nextPlayer.current === null) {
            return board;
        }
        const tmp = [...board];
        tmp[x].array[y].point = nextPlayer.current;
        const winner = getWinner(board, x, y);
        if (winner) {
            nextPlayer.current = null;
            const onCancel = () => dialog.setOpen(false);
            header.setTopBarTitle(`赢家：${winner} | ${topBarTitle}`);
            dialog.setTitle("赢了！");
            dialog.setContent(<>{`恭喜：${winner}`}</>);
            dialog.setActions(<Button onClick={onCancel}>确定</Button>);
            dialog.setOnCancel(() => onCancel);
            dialog.setOpen(true);
        } else {
            nextPlayer.current =
                nextPlayer.current === "black" ? "white" : "black";
            header.setTopBarTitle(`下一步：${nextPlayer.current} | ${topBarTitle}`);
        }
        return tmp;
    }
    return board;
};
