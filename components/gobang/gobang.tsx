import {useState} from "react";
import {Stack} from "@mui/material";
import {Point} from "./board_components";

export type Black = "black"
export type White = "white"
export type Status = Black | White

type GobangProps = {
    board: (null | undefined | Status)[][]
    onBoardStateChange: (board: (null | undefined | Status)[][]) => void
}

const Gobang = ({board, onBoardStateChange}: GobangProps) => {
    const [current, setCurrent] = useState<Status>(black);

    return (<>
        <Stack overflow="scroll">
            {board.map((columns, rowIndex) => {
                return <Stack direction="row" key={rowIndex}>
                    {columns.map((point, columnIndex) => {
                        if (point === undefined) return <Point size={100} key={columnIndex}/>
                        const type = {
                            left: columns[columnIndex - 1] !== undefined,
                            top: board[rowIndex - 1][columnIndex] !== undefined,
                            right: columns[columnIndex + 1] !== undefined,
                            bottom: board[rowIndex + 1][columnIndex] !== undefined
                        };
                        return <Point size={100} {...type} pointType={column ? column : "normal"} key={columnIndex}/>
                    })}
                </Stack>;
            })}
        </Stack>
    </>);
};

export default Gobang;