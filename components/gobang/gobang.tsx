import {Stack} from "@mui/material";
import React, {MouseEventHandler} from "react";
import {Point, PointProps} from "./board_components";

export type PointTypes = "normal" | "main";
export type Player = "black" | "white";

export type GobangPoint = {point: null | undefined | Player; id: string};
export type GobangBoard = {array: GobangPoint[]; id: string}[];

type GobangProps = {
    board: GobangBoard;
    onBoardStateChange: (x: number, y: number) => void;
    size: number;
};

const MemorizedPoint = React.memo<
    Omit<PointProps, "onClick"> & {
        onBoardStateChange?: (x: number, y: number) => void;
    }
>(
    function MemorizedPoint(props) {
        console.log("Rendered!!!");
        const onClick: MouseEventHandler<SVGSVGElement> | undefined =
            props.pointType !== undefined
                ? (_) => {
                      if (
                          props.onBoardStateChange !== undefined &&
                          props.x !== undefined &&
                          props.y !== undefined
                      ) {
                          props.onBoardStateChange(props.x, props.y);
                      }
                  }
                : undefined;
        const result = {...props};
        if (result.onBoardStateChange !== undefined)
            delete result.onBoardStateChange;
        return <Point onClick={onClick} {...props} />;
    },
    function areEqual(a, b) {
        return (
            a.size === b.size &&
            a.left === b.left &&
            a.top === b.top &&
            a.right === b.right &&
            a.bottom === b.bottom &&
            a.pointType === b.pointType
        );
    }
);

const Gobang = ({board, onBoardStateChange, size}: GobangProps) => {
    return (
        <Stack overflow="auto" alignItems="flex-start" mx="auto">
            {board.map((row, rowIndex) => {
                const columns = row.array;
                return (
                    <Stack direction="row" key={row.id}>
                        {columns.map(({point, id}, columnIndex) => {
                            if (point === undefined)
                                return <MemorizedPoint size={size} key={id} />;
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
                                    size={size}
                                    x={rowIndex}
                                    y={columnIndex}
                                    {...type}
                                    pointType={point ? point : "normal"}
                                    onBoardStateChange={onBoardStateChange}
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
