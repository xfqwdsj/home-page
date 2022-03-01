import {styled} from "@mui/material";
import {SVGProps} from "react";
import {Status} from "./gobang";

export type Normal = "normal"
export type Main = "main"
export type PointTypes = Normal | Main

type PointProps = {
    size: number
    left: boolean
    top: boolean
    right: boolean
    bottom: boolean
    pointType: PointTypes | Status
} | {
    size: number
}

export const Point = (props: PointProps) => {
    if (props.size < 40) return <></>;
    const {left, top, right, bottom, pointType} = "pointType" in props ? props : {
        false,
        false,
        false,
        false,
        undefined,
    };
    const Svg = styled((it: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) =>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`} {...it}/>)({
        width: size,
        height: size,
    });
    let back: JSX.Element;
    let path = "";
    let front = <path/>;
    const chess = `M ${size / 6} ${size / 2} a ${size / 6} ${size / 6} 0 0 0 ${size / 3} 0 a ${size / 6} ${size / 6} 0 0 0 -${size / 3} 0 Z`;
    if (left) path += `M 0 ${size / 2 - 0.5} h ${size / 2} v 1 h -${size / 2} Z`;
    if (top) path += `M ${size / 2 - 0.5} 0 v ${size / 2} h 1 v -${size / 2} Z`;
    if (right) path += `M ${size / 2} ${size / 2 - 0.5} h ${size / 2} v 1 h -${size / 2} Z`;
    if (bottom) path += `M ${size / 2 - 0.5} ${size / 2} v ${size / 2} h 1 v -${size / 2} Z`;
    switch (pointType) {
        case "normal":
            path += `M ${size / 2 - 2.5} ${size / 2} a 2.5 2.5 0 0 0 5 0 a 2.5 2.5 0 0 0 -5 0 Z`;
            break;
        case "main":
            path += `M ${size / 2 - 5} ${size / 2} a 5 5 0 0 0 10 0 a 5 5 0 0 0 -10 0 Z`;
            break;
        case "black":
            front = <path d={chess} fill="#000" stroke="#fff"/>;
            break;
        case "white":
            front = <path d={chess} fill="#fff" stroke="#000"/>;
            break;
    }
    back = <path d={path}/>;
    return <Svg>{back}{front}</Svg>;
};