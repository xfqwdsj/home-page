import {HeadProps} from "../../../components/head";
import {GetStaticProps, NextPage} from "next";
import Gobang, {GobangBoard, Player} from "../../../components/gobang/gobang";
import {Reducer, useEffect, useReducer, useState} from "react";
import {
    Button,
    Collapse,
    List,
    ListItemButton,
    ListItemText,
    Slider,
} from "@mui/material";
import {AppDialogController, AppHeaderController} from "../../_app";
import {
    defaultBoard,
    getWinner,
} from "../../../components/gobang/fifteenFifteenFive";
import {
    GithubAuthProvider,
    onAuthStateChanged,
    signInWithRedirect,
} from "firebase/auth";
import {ref, off, onValue, set, update} from "firebase/database";
import {firebaseAuth, firebaseDatabase} from "../../../components/firebase";

const head: HeadProps = {
    pageTitle: "五子棋 | 在 LTFan 上面对面进行的游戏",
    pageDescription: "Would you like to try it on?",
    topBarTitle: "在线游戏 | 五子棋",
};

export const getStaticProps: GetStaticProps = () => ({
    props: {
        head,
    },
});

type ServerSideRoomData = {
    name: string;
    status: "wait-for-start" | "playing" | "end";
    time: number;
};

const calculateState: Reducer<
    {board: GobangBoard; room?: string; player?: Player; me?: Player},
    | {
          type: "updateBoard";
          dialog: AppDialogController;
          header: AppHeaderController;
          x: number;
          y: number;
      }
    | {
          type: "init";
          joinedRoom: string;
      }
> = ({board, room, player, me}, action) => {
    switch (action.type) {
        case "updateBoard":
            const {dialog, header, x, y} = action;
            if (
                player &&
                me &&
                x !== undefined &&
                y !== undefined &&
                (board[x].array[y].point === "normal" ||
                    board[x].array[y].point === "main")
            ) {
                const tmp = [...board];
                const nextPlayer = player === "black" ? "white" : "black";
                tmp[x].array[y].point = player;
                header.setTopBarTitle(
                    `下一步：${nextPlayer} | ${head.topBarTitle}`
                );
                const winner = getWinner(board, x, y);
                if (winner) {
                    const onCancel = () => dialog.setOpen(false);
                    dialog.setTitle("赢了！");
                    dialog.setContent(<>{`恭喜：${winner}`}</>);
                    dialog.setActions(<Button onClick={onCancel}>确定</Button>);
                    dialog.setOnCancel(onCancel);
                    dialog.setOpen(true);
                }
                return {board: tmp, room, player: nextPlayer, me};
            }
            break;
        case "init":
            return {
                board: defaultBoard(),
                room: action.joinedRoom,
                player,
                me,
            };
    }
    return {board, room, player, me};
};

const OnlineGobang: NextPage<{
    header: AppHeaderController;
    dialog: AppDialogController;
}> = ({header, dialog}) => {
    const [{board, room}, dispatchState] = useReducer(calculateState, {
        board: defaultBoard(),
    });
    const [size, setSize] = useState(50);
    const [canSetRoom, setCanSetRoom] = useState(false);
    const [rooms, setRooms] = useState<Record<string, ServerSideRoomData>>({});

    useEffect(() => {
        const publicRooms = ref(firebaseDatabase, "rooms/public");

        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                setCanSetRoom(true);
                onValue(publicRooms, (snapshot) => {
                    const val = snapshot.val() as Record<
                        string,
                        ServerSideRoomData
                    > | null;
                    if (val) {
                        setRooms(val);
                    }
                });
            } else {
                setCanSetRoom(false);
                off(publicRooms);
                const provider = new GithubAuthProvider();
                signInWithRedirect(firebaseAuth, provider);
            }
        });

        const cleanup = () => {
            off(publicRooms);
            unsubscribe();
        };
        window.addEventListener("beforeunload", cleanup);

        return () => {
            cleanup();
            window.removeEventListener("beforeunload", cleanup);
        };
    }, []);

    return (
        <>
            <Collapse in={canSetRoom}>
                <List>
                    <ListItemButton
                        onClick={() => {
                            setCanSetRoom(false);
                            if (firebaseAuth.currentUser) {
                                const time = new Date().getTime();
                                set(
                                    ref(
                                        firebaseDatabase,
                                        `games/${firebaseAuth.currentUser.uid}/time`
                                    ),
                                    time
                                );
                                set(
                                    ref(
                                        firebaseDatabase,
                                        `games/${firebaseAuth.currentUser.uid}/next`
                                    ),
                                    firebaseAuth.currentUser.uid
                                );
                                set(
                                    ref(
                                        firebaseDatabase,
                                        `games/${firebaseAuth.currentUser.uid}/players/black`
                                    ),
                                    firebaseAuth.currentUser.uid
                                );
                                set(
                                    ref(
                                        firebaseDatabase,
                                        `rooms/public/${firebaseAuth.currentUser.uid}`
                                    ),
                                    {
                                        name: `${
                                            firebaseAuth.currentUser.email
                                                ? firebaseAuth.currentUser.email
                                                : firebaseAuth.currentUser.uid
                                        } 的房间`,
                                        status: "wait-for-start",
                                        time,
                                    } as ServerSideRoomData
                                );
                            }
                        }}
                        disabled={!canSetRoom}
                    >
                        <ListItemText primary="发布" secondary="创建新房间" />
                    </ListItemButton>
                    {Object.keys(rooms).map((id) => (
                        <ListItemButton
                            onClick={() => {
                                setCanSetRoom(false);
                                dispatchState({
                                    type: "init",
                                    joinedRoom: id,
                                });
                            }}
                            disabled={!canSetRoom}
                            key={id}
                        >
                            <ListItemText
                                primary={rooms[id].name}
                                secondary={id}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Collapse>
            <Gobang
                board={board}
                onPointClick={(x, y) =>
                    dispatchState({type: "updateBoard", header, dialog, x, y})
                }
                size={size}
            />
            <Slider
                aria-label="Board Size"
                min={0}
                max={100}
                value={size}
                onChange={(_, newValue) => setSize(newValue as number)}
                valueLabelDisplay="auto"
            />
        </>
    );
};

export default OnlineGobang;
