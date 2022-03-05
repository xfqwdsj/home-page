import {Stack} from "@mui/material";
import React, {MouseEventHandler} from "react";
import {Point, PointProps} from "./board_components";

export type PointTypes = "normal" | "main";
export type Player = "black" | "white";

export type GobangPoint = {point: undefined | PointTypes | Player; id: string};
export type GobangBoard = {array: GobangPoint[]; id: string}[];

type GobangProps = {
    board: GobangBoard;
    onPointClick: (x: number, y: number) => void;
    size: number;
};

const MemorizedPoint = React.memo<
    Omit<PointProps, "onClick"> & {
        onPointClick?: (x: number, y: number) => void;
    }
>(
    function MemorizedPoint(props) {
        const onClick: MouseEventHandler<SVGSVGElement> | undefined =
            props.pointType !== undefined
                ? (_) => {
                      if (
                          props.onPointClick !== undefined &&
                          props.x !== undefined &&
                          props.y !== undefined
                      ) {
                          props.onPointClick(props.x, props.y);
                      }
                  }
                : undefined;
        const result = {...props};
        if (result.onPointClick !== undefined) delete result.onPointClick;
        return <Point onClick={onClick} {...props} />;
    },
    (a, b) => {
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

const Gobang = ({board, onPointClick, size}: GobangProps) => {
    return (
        <Stack overflow="auto" alignItems="flex-start">
            {board.map((row, rowIndex) => {
                const columns = row.array;
                return (
                    <Stack direction="row" mx="auto" key={row.id}>
                        {columns.map(({point, id}, columnIndex) => {
                            if (point === undefined)
                                return <MemorizedPoint size={size} key={id} />;
                            return (
                                <MemorizedPoint
                                    size={size}
                                    x={rowIndex}
                                    y={columnIndex}
                                    left={
                                        columns[columnIndex - 1] &&
                                        columns[columnIndex - 1].point !==
                                            undefined
                                    }
                                    top={
                                        board[rowIndex - 1] &&
                                        board[rowIndex - 1].array[
                                            columnIndex
                                        ] &&
                                        board[rowIndex - 1].array[columnIndex]
                                            .point !== undefined
                                    }
                                    right={
                                        columns[columnIndex + 1] &&
                                        columns[columnIndex + 1].point !==
                                            undefined
                                    }
                                    bottom={
                                        board[rowIndex + 1] &&
                                        board[rowIndex + 1].array[
                                            columnIndex
                                        ] &&
                                        board[rowIndex + 1].array[columnIndex]
                                            .point !== undefined
                                    }
                                    pointType={point ? point : "normal"}
                                    onPointClick={onPointClick}
                                    key={id}
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
