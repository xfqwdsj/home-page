import {HeadProps} from "../../../components/head";
import {GetStaticProps, NextPage} from "next";
import Gobang, {
    GobangBoard,
    Player,
    PointTypes,
} from "../../../components/gobang/gobang";
import {useState} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slider,
    Typography,
} from "@mui/material";
import {nanoid} from "nanoid";

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

const NearbyGobang: NextPage = () => {
    const [current, setCurrent] = useState<Player>("black");
    const [board, setBoard] = useState<GobangBoard>(() => defaultBoard());
    const [size, setSize] = useState(100);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    let programCurrent: Player = "black";

    const stateChange = (x: number, y: number) => {
        if (!board[x].array[y].point) {
            const tmp = [...board];
            tmp[x].array[y].point = programCurrent;
            setBoard(tmp);
            programCurrent = programCurrent === "black" ? "white" : "black";
            setCurrent(programCurrent);
            const winner = getWinner(board, x, y);
            if (winner) {
                setMessage(`恭喜：${winner}`);
                setOpen(true);
            }
        }
    };

    return (
        <>
            <Box width="max-content" mx="auto">
                <Typography component="span">下一步：{current}</Typography>
            </Box>
            <Gobang
                board={board}
                onBoardStateChange={stateChange}
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
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">赢了！</DialogTitle>
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
