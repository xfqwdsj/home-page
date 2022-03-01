import {useState} from "react";
import {Stack} from "@mui/material";
import {Point} from "./board_components";

type GobangProps = {
    board: (null | undefined | 0 | 1)[][]
    onBoardStateChange: (board: (null | undefined | 0 | 1)[][]) => void
}

const Gobang = ({board, onBoardStateChange}: GobangProps) => {
    const [current, setCurrent] = useState<0 | 1>(0);

    return (<>
        <Point type="topLeft" size={50} pointType="normal"/>
        <Point type="noTop" size={50} pointType="main"/>
        <Point type="right" size={50} pointType="black"/>
        <Point type="horizontal" size={100} pointType="white"/>
    </>);
};

export default Gobang;