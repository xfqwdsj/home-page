import { GobangBoard, PointTypes } from "./gobang";
import {nanoid} from "nanoid";

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