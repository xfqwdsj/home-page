import {useState} from "react";
import {Stack} from "@mui/material";
import {Point} from "./board_components";

export type PointTypes = "normal" | "main"
export type Player = "black" | "white"

export type GobangPoint = null | undefined | Player;
export type GobangBoard = (GobangPoint)[][];

type GobangProps = {
    board: GobangBoard
    onBoardStateChange: (board: GobangBoard, x: number, y: number) => void
}

const Gobang = ({board, onBoardStateChange}: GobangProps) => {
    const [current, setCurrent] = useState<Player>("black");

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
                                          onBoardStateChange(board, rowIndex, columnIndex);
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

export interface Board {
    board?: () => GobangBoard;
    left?: (board: GobangBoard, row: number, column: number) => [GobangPoint, [number, number]];
    topLeft?: (board: GobangBoard, row: number, column: number) => [GobangPoint, [number, number]];
    top?: (board: GobangBoard, row: number, column: number) => [GobangPoint, [number, number]];
    topRight?: (board: GobangBoard, row: number, column: number) => [GobangPoint, [number, number]];
    right?: (board: GobangBoard, row: number, column: number) => [GobangPoint, [number, number]];
    bottomRight?: (board: GobangBoard, row: number, column: number) => [GobangPoint, [number, number]];
    bottom?: (board: GobangBoard, row: number, column: number) => [GobangPoint, [number, number]];
    bottomLeft?: (board: GobangBoard, row: number, column: number) => [GobangPoint, [number, number]];
    winner?: ((board: GobangBoard, row?: number, column?: number) => Player | undefined)
        | ((board: GobangBoard, row: number, column: number) => Player | undefined)
        | ((board: GobangBoard) => Player | undefined);
}