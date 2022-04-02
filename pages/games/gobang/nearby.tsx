import { HeadProps } from "../../../components/head";
import { GetStaticProps, NextPage } from "next";
import Gobang, { GobangBoard, Player } from "../../../components/gobang/gobang";
import { MutableRefObject, Reducer, useReducer, useRef, useState } from "react";
import { Slider } from "@mui/material";
import { AppDialogController, AppHeaderController } from "../../_app";
import {
  defaultBoard,
  drop,
} from "../../../components/gobang/fifteenFifteenFive";

const head: HeadProps = {
  pageTitle: "五子棋 | 在 LTFan 上面对面进行的游戏",
  pageDescription: "Would you like to try it on?",
  topBarTitle: "面对面游戏 | 五子棋",
};

export const getStaticProps: GetStaticProps = () => ({
  props: {
    head,
  },
});

const doOnPointClick: Reducer<
  { board: GobangBoard },
  {
    dialog: AppDialogController;
    header: AppHeaderController;
    nextPlayer: MutableRefObject<Player | null>;
    x: number;
    y: number;
  }
> = ({ board }, { dialog, header, nextPlayer, x, y }) => {
  return {
    board: drop(board, x, y, nextPlayer, dialog, header, head.topBarTitle),
  };
};

const NearbyGobang: NextPage<{
  header: AppHeaderController;
  dialog: AppDialogController;
}> = ({ header, dialog }) => {
  const [{ board }, dispatchState] = useReducer(doOnPointClick, {
    board: defaultBoard(),
  });
  const [size, setSize] = useState(50);
  const nextPlayer = useRef<Player>("black");

  return (
    <>
      <Gobang
        board={board}
        onPointClick={(x, y) =>
          dispatchState({ header, dialog, nextPlayer, x, y })
        }
        size={size}
      />
      <Slider
        aria-label="Board Size"
        value={size}
        onChange={(_: any, newValue: number) => setSize(newValue)}
        valueLabelDisplay="auto"
      />
    </>
  );
};

export default NearbyGobang;
