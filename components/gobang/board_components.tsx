import {styled} from "@mui/material";
import {SVGProps} from "react";

type PointProps = ({
    type: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "all" | "left" | "top" | "right" | "bottom"
        | "noLeft" | "noTop" | "noRight" | "noBottom" | "vertical" | "horizontal"
    pointType: "normal" | "main" | "black" | "white"
} | { type: "none" }) & { size: number }

export const Point = (props: PointProps) => {
    if (props.size < 40) return <></>;
    const {size} = props;
    const defaultSvg = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => <svg
        xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`} {...props}/>;
    const Svg = styled(defaultSvg)({
        width: size,
        height: size,
    });
    if (props.type === "none") return <Svg/>;
    const {type, pointType} = props;
    let back: JSX.Element;
    let path = "";
    let front = <path/>;
    const chess = `M ${size / 4} ${size / 4} a ${size / 4} ${size / 4} 0 0 0 ${size / 2} 0 a ${size / 4} ${size / 4} 0 0 0 -${size / 2} 0 Z`;
    if (type === "topRight" || type === "bottomRight" || type === "all" || type === "left" || type === "noTop"
        || type === "noRight" || type === "noBottom" || type === "horizontal") {
        path += `M 0 ${size / 2 - 0.5} h ${size / 2} v 1 h -${size / 2} Z`;
    }
    if (type === "bottomLeft" || type === "bottomRight" || type === "all" || type === "top" || type === "noLeft"
        || type === "noRight" || type === "noBottom" || type === "vertical") {
        path += `M ${size / 2 - 0.5} 0 v ${size / 2} h 1 v -${size / 2} Z`;
    }
    if (type === "topLeft" || type === "bottomLeft" || type === "all" || type === "right" || type === "noLeft"
        || type === "noTop" || type === "noBottom" || type === "horizontal") {
        path += `M ${size / 2} ${size / 2 - 0.5} h ${size / 2} v 1 h -${size / 2} Z`;
    }
    if (type === "topLeft" || type === "topRight" || type === "all" || type === "bottom" || type === "noLeft"
        || type === "noTop" || type === "noRight" || type === "vertical") {
        path += `M ${size / 2 - 0.5} ${size / 2} v ${size / 2} h 1 v -${size / 2} Z`;
    }
    switch (pointType) {
        case "normal":
            path += `M ${size / 2 - 2.5} ${size / 2} a 2.5 2.5 0 0 0 2.5 0 a 2.5 2.5 0 0 0 -2.5 0 Z`;
            break;
        case "main":
            path += `M ${size / 2 - 5} ${size / 2} a 5 5 0 0 0 5 0 a 5 5 0 0 0 -5 0 Z`;
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