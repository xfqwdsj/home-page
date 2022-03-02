import {HeadProps} from "../../../components/head";
import {GetStaticProps, NextPage} from "next";
import Gobang, {Board, GobangBoard, GobangPoint} from "../../../components/gobang/gobang";
import {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

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

const mBoard: Required<Board> = {
    defaultBoard: () => new Array<GobangPoint[]>(15).map((_) =>
        new Array<GobangPoint>(15).map((_) =>
            null,
        ),
    ),
    left: (board, row, column) => [board[row][column - 1], [row, column - 1]],
    topLeft: (board, row, column) =>
        [
            board[row - 1] ? board[row - 1][column - 1] : undefined,
            [row - 1,
                column - 1],
        ],
    top: (board, row, column) =>
        [
            board[row - 1] ? board[row - 1][column] : undefined,
            [row - 1,
                column],
        ],
    topRight: (board, row, column) =>
        [
            board[row - 1] ? board[row - 1][column + 1] : undefined,
            [row - 1,
                column + 1],
        ],
    right: (board, row, column) => [board[row][column + 1], [row, column + 1]],
    bottomRight: (board, row, column) =>
        [
            board[row + 1] ? board[row + 1][column + 1] : undefined,
            [row + 1,
                column + 1],
        ],
    bottom: (board, row, column) =>
        [
            board[row + 1] ? board[row + 1][column] : undefined,
            [row + 1,
                column],
        ],
    bottomLeft: (board, row, column) =>
        [
            board[row + 1] ? board[row + 1][column - 1] : undefined,
            [row + 1,
                column - 1],
        ],
    winner: (board, row: number, column: number) => {
        const player = board[row][column];
        if (player) {
            let tmp = 1;
            const go = (i: number, r: number, c: number) => {
                switch (i) {
                    case 1:
                        return this.left(board, r, c)[1] as [number, number];
                    case 2:
                        return this.right(board, r, c)[1] as [number, number];
                    case 3:
                        return this.top(board, r, c)[1] as [number, number];
                    case 4:
                        return this.bottom(board, r, c)[1] as [number, number];
                    case 5:
                        return this.bottomLeft(board, r, c)[1] as [number, number];
                    case 6:
                        return this.topRight(board, r, c)[1] as [number, number];
                    case 7:
                        return this.topLeft(board, r, c)[1] as [number, number];
                    case 8:
                        return this.bottomRight(board, r, c)[1] as [number, number];
                }
            };
            for (let i = 1; i <= 8; i++) {
                if (tmp >= 5) return player;
                if (i % 2 === 1) tmp = 0;
                ((r: number, c: number) => {
                    if (board[r][c] === player) {
                        tmp++;
                        arguments.callee(...go(i, r, c));
                    }
                })(row, column);
            }
            return undefined;
        }
    },
};

const NearbyGobang: NextPage = () => {
    const [board, setBoard] = useState<GobangBoard>(mBoard.defaultBoard());
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    return (
        <>
            <Gobang board={board} onBoardStateChange={(value, x, y) => {
                setBoard(value);
                const winner = mBoard.winner(board, x, y);
                if (winner) {
                    setMessage(winner);
                    setOpen(true);
                }
            }}/>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">哈哈</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} autoFocus>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default NearbyGobang;
