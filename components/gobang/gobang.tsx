import {useState} from "react";
import {Stack} from "@mui/material";
import {Point} from "./board_components";

export type PointTypes = "normal" | "main"
export type Status = "black" | "white"

export type GobangBoard = (null | undefined | Status)[][];

type GobangProps = {
    board: GobangBoard
    onBoardStateChange: (GobangBoard) => void
}

const Gobang = ({board, onBoardStateChange}: GobangProps) => {
    const [current, setCurrent] = useState<Status>("black");

    return (
        <Stack overflow="scroll" alignItems="center">
            {board.map((columns, rowIndex) => {
                return <Stack direction="row" key={rowIndex}>
                    {columns.map((point, columnIndex) => {
                        if (point === undefined) return <Point size={100} key={columnIndex}/>;
                        const type = {
                            left: columns[columnIndex - 1] !== undefined,
                            top: board[rowIndex - 1] && board[rowIndex - 1][columnIndex] !== undefined,
                            right: columns[columnIndex + 1] !== undefined,
                            bottom: board[rowIndex + 1] && board[rowIndex + 1][columnIndex] !== undefined,
                        };
                        return <Point size={100} {...type} pointType={point ? point : "normal"}
                                      onClick={(_) => {
                                          board[rowIndex][columnIndex] = current;
                                          onBoardStateChange(board);
                                          setCurrent(current === "black" ? "white" : "black");
                                      }}
                                      key={columnIndex}/>;
                    })}
                </Stack>;
            })}
        </Stack>
    );
};

export default Gobang;