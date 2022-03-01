import {useState} from "react";
import {Stack} from "@mui/material";
import {BottomLeft, BottomRight, Point, TopLeft, TopRight} from "./board_components";

type GobangProps = {
    board: (null | 0 | 1)[][]
    onBoardStateChange: (board: (null | 0 | 1)[][]) => void
}

const Gobang = ({board, onBoardStateChange}: GobangProps) => {
    const [current, setCurrent] = useState<0 | 1>(0);

    return (<>
        <Stack overflow="scroll">
            {board.map((columns, rowIndex) => {
                return <Stack direction="column" overflow="visible" key={rowIndex}>
                    {columns.map((point, columnIndex) => {
                        if (rowIndex === 0 && columnIndex === 0 && board[rowIndex + 1][columnIndex] !== undefined) {
                            return <TopLeft key={columnIndex}/>;
                        }
                        if (rowIndex === 0 && columns[columnIndex + 1] === undefined && board[rowIndex + 1][columnIndex] !== undefined) {
                            return <TopRight key={columnIndex}/>;
                        }
                        if (board[rowIndex + 1] === undefined && columnIndex === 0 && board[rowIndex - 1][columnIndex] !== undefined) {
                            return <BottomLeft key={columnIndex}/>;
                        }
                        if (board[rowIndex + 1] === undefined && columns[columnIndex + 1] === undefined && board[rowIndex - 1][columnIndex] !== undefined) {
                            return <BottomRight key={columnIndex}/>;
                        }
                        return <Point key={columnIndex}/>;
                    })}
                </Stack>;
            })}
        </Stack>
    </>);
};

export default Gobang;