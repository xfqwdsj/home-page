import {styled} from "@mui/material";
import React from "react";
import {MouseEventHandler, SVGProps} from "react";
import {Player, PointTypes} from "./gobang";

export type PointProps = {
    /**
     * 以像素为单位的每个点的大小，应不小于 40。
     */
    size: number;
    /**
     * 是否绘制连接左边的线条。
     * @default false
     */
    left?: boolean;
    /**
     * 是否绘制连接上边的线条。
     * @default false
     */
    top?: boolean;
    /**
     * 是否绘制连接右边的线条。
     * @default false
     */
    right?: boolean;
    /**
     * 是否绘制连接下边的线条。
     * @default false
     */
    bottom?: boolean;
    /**
     * 该点类型。分别为：普通、主要（较大的点）、黑棋落、白棋落。
     */
    pointType?: PointTypes | Player;
    /**
     * 点击处理。
     */
    onClick?: MouseEventHandler<SVGSVGElement>;
};

const defaultProps = {
    left: false,
    top: false,
    right: false,
    bottom: false,
};

export const Point = React.memo<PointProps>((props) => {
    const {size, left, top, right, bottom, pointType, onClick} = {
        ...defaultProps,
        ...props,
    };
    const Svg = styled(
        (it: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${size} ${size}`}
                onClick={onClick}
                {...it}
            />
        )
    )({
        width: size,
        height: size,
    });
    if (size < 40) return <Svg />;
    let leftPath,
        topPath,
        rightPath,
        bottomPath,
        point,
        front: JSX.Element | undefined;
    const chess = `M ${size / 3} ${size / 2} a ${size / 6} ${size / 6} 0 0 0 ${
        size / 3
    } 0 a ${size / 6} ${size / 6} 0 0 0 -${size / 3} 0 Z`;
    if (left)
        leftPath = (
            <path
                d={`M 0 ${size / 2 - 0.5} h ${size / 2} v 1 h -${size / 2} Z`}
            />
        );
    if (top)
        topPath = (
            <path
                d={`M ${size / 2 - 0.5} 0 v ${size / 2} h 1 v -${size / 2} Z`}
            />
        );
    if (right)
        rightPath = (
            <path
                d={`M ${size / 2} ${size / 2 - 0.5} h ${size / 2} v 1 h -${
                    size / 2
                } Z`}
            />
        );
    if (bottom)
        bottomPath = (
            <path
                d={`M ${size / 2 - 0.5} ${size / 2} v ${size / 2} h 1 v -${
                    size / 2
                } Z`}
            />
        );
    switch (pointType) {
        case "normal":
            point = (
                <path
                    d={`M ${size / 2 - 2.5} ${
                        size / 2
                    } a 2.5 2.5 0 0 0 5 0 a 2.5 2.5 0 0 0 -5 0 Z`}
                />
            );
            break;
        case "main":
            point = (
                <path
                    d={`M ${size / 2 - 5} ${
                        size / 2
                    } a 5 5 0 0 0 10 0 a 5 5 0 0 0 -10 0 Z`}
                />
            );
            break;
        case "black":
            front = <path d={chess} fill="#000" stroke="#fff" />;
            break;
        case "white":
            front = <path d={chess} fill="#fff" stroke="#000" />;
            break;
    }
    return (
        <Svg>
            {leftPath && leftPath}
            {topPath && topPath}
            {rightPath && rightPath}
            {bottomPath && bottomPath}
            {point && point}
            {front && front}
        </Svg>
    );
});
Point.displayName = "Point";

/*
export class Point1 extends React.Component<PointProps> {
    render() {
        const {size, left, top, right, bottom, pointType, onClick} = {
            ...defaultProps,
            ...this.props,
        }

    }
}*/
