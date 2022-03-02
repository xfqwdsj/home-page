import {Stack} from "@mui/material";
import {Point} from "./board_components";

export type PointTypes = "normal" | "main";
export type Player = "black" | "white";

export type GobangPoint = null | undefined | Player;
export type GobangBoard = GobangPoint[][];

type GobangProps = {
    board: GobangBoard;
    onBoardStateChange: (x: number, y: number) => void;
};

const Gobang = ({board, onBoardStateChange}: GobangProps) => {
    return (
        <Stack overflow="auto" alignItems="flexStart" mx="auto">
            {board.map((columns, rowIndex) => {
                return (
                    <Stack direction="row" key={rowIndex}>
                        {columns.map((point, columnIndex) => {
                            if (point === undefined)
                                return <Point size={100} key={columnIndex} />;
                            const type = {
                                left: columns[columnIndex - 1] !== undefined,
                                top:
                                    board[rowIndex - 1] &&
                                    board[rowIndex - 1][columnIndex] !==
                                        undefined,
                                right: columns[columnIndex + 1] !== undefined,
                                bottom:
                                    board[rowIndex + 1] &&
                                    board[rowIndex + 1][columnIndex] !==
                                        undefined,
                            };
                            return (
                                <Point
                                    size={100}
                                    {...type}
                                    pointType={point ? point : "normal"}
                                    onClick={(_) => {
                                        onBoardStateChange(
                                            rowIndex,
                                            columnIndex
                                        );
                                    }}
                                    key={columnIndex}
                                />
                            );
                        })}
                    </Stack>
                );
            })}
        </Stack>
    );
};

export default Gobang;
