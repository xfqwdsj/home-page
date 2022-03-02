import {Stack} from "@mui/material";
import React from "react";
import {Point, PointProps} from "./board_components";

export type PointTypes = "normal" | "main";
export type Player = "black" | "white";

export type GobangPoint = {point: null | undefined | Player; id: string};
export type GobangBoard = {array: GobangPoint[]; id: string}[];

type GobangProps = {
    board: GobangBoard;
    onBoardStateChange: (x: number, y: number) => void;
};

const MemorizedPoint = React.memo<PointProps>((props) => {
    console.log("Rendered!!!");
    return <Point {...props} />;
});
MemorizedPoint.displayName = "MemorizedPoint";

const Gobang = ({board, onBoardStateChange}: GobangProps) => {
    return (
        <Stack overflow="auto" alignItems="flex-start" mx="auto">
            {board.map((row, rowIndex) => {
                const columns = row.array;
                return (
                    <Stack direction="row" key={row.id}>
                        {columns.map(({point, id}, columnIndex) => {
                            if (point === undefined)
                                return <MemorizedPoint size={100} key={id} />;
                            const type = {
                                left:
                                    columns[columnIndex - 1] &&
                                    columns[columnIndex - 1].point !==
                                        undefined,
                                top:
                                    board[rowIndex - 1] &&
                                    board[rowIndex - 1].array[columnIndex] &&
                                    board[rowIndex - 1].array[columnIndex]
                                        .point !== undefined,
                                right:
                                    columns[columnIndex + 1] &&
                                    columns[columnIndex + 1].point !==
                                        undefined,
                                bottom:
                                    board[rowIndex + 1] &&
                                    board[rowIndex + 1].array[columnIndex] &&
                                    board[rowIndex + 1].array[columnIndex]
                                        .point !== undefined,
                            };
                            return (
                                <MemorizedPoint
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
