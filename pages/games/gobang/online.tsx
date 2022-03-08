import {HeadProps} from "../../../components/head";
import {GetStaticProps, NextPage} from "next";
import Gobang, {GobangBoard, Player} from "../../../components/gobang/gobang";
import {
    MutableRefObject,
    Reducer,
    useEffect,
    useReducer,
    useRef,
    useState,
} from "react";
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
    drop,
} from "../../../components/gobang/fifteenFifteenFive";
import {
    GithubAuthProvider,
    onAuthStateChanged,
    signInWithRedirect,
} from "firebase/auth";
import {remove, off, onValue, ref, set} from "firebase/database";
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

type State = {board: GobangBoard; room?: string; me?: Player};

type Action = (
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
          dispatch: Dispatch<Action>;
      }
) & {
    nextPlayer: MutableRefObject<Player | null>;
};

const calculateState: Reducer<State, Action> = ({board, room, me}, action) => {
    const {nextPlayer} = action;
    switch (action.type) {
        case "updateBoard":
            const {dialog, header, x, y} = action;
            set(
                ref(firebaseDatabase, `games/${room}/time`),
                new Date().getTime()
            );
            set(ref(firebaseDatabase, `games/${room}/current`), {
                player: me,
                x,
                y,
            });
            return {
                board: drop(
                    board,
                    x,
                    y,
                    nextPlayer,
                    dialog,
                    header,
                    head.topBarTitle
                ),
                room,
                me,
            };
        case "init":
            set(
                ref(firebaseDatabase, `games/${action.joinedRoom}/time`),
                new Date().getTime()
            );
            set(
                ref(
                    firebaseDatabase,
                    `games/${action.joinedRoom}/players/white`
                ),
                firebaseAuth.currentUser?.uid
            );
            onValue(
                ref(firebaseDatabase, `games/${action.joinedRoom}/current`),
                (snapshot) => {
                    if (
                        snapshot.child("player").val() !== me &&
                        snapshot.child("player").val() === nextPlayer.current
                    ) {
                        action.dispatch({
                            type: "updateBoard",
                            dialog,
                            header,
                            x: snapshot.child("x").val() as number,
                            y: snapshot.child("y").val() as number,
                            nextPlayer,
                        });
                    }
                }
            );
            /*
            onValue(
                ref(
                    firebaseDatabase,
                    `games/${room}/players/${
                        me === "black" ? "white" : "black"
                    }`
                ), (snapshot) => {

                }
            );
            off(
                ref(
                    firebaseDatabase,
                    `games/${room}/winner/${me === "black" ? "white" : "black"}`
                )
            );
            */
            return {
                board: defaultBoard(),
                room: action.joinedRoom,
                me: "white",
            };
    }
};

const OnlineGobang: NextPage<{
    header: AppHeaderController;
    dialog: AppDialogController;
}> = ({header, dialog}) => {
    const [{board, room, me}, dispatchState] = useReducer(calculateState, {
        board: defaultBoard(),
    });
    const [size, setSize] = useState(50);
    const [canSetRoom, setCanSetRoom] = useState(false);
    const [rooms, setRooms] = useState<Record<string, ServerSideRoomData>>({});
    const nextPlayer = useRef<Player>("black");
    const roomRef = useRef(room);
    const meRef = useRef(me);

    useEffect(() => {
        roomRef.current = room;
        meRef.current = me;
    }, [room, me]);

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
            if (roomRef.current !== undefined && meRef !== undefined) {
                if (firebaseAuth.currentUser?.uid === roomRef.current) {
                    const time = new Date().getTime();
                    off(
                        ref(
                            firebaseDatabase,
                            `games/${roomRef.current}/current`
                        )
                    );
                    off(
                        ref(
                            firebaseDatabase,
                            `games/${roomRef.current}/players/${
                                meRef.current === "black" ? "white" : "black"
                            }`
                        )
                    );
                    off(
                        ref(
                            firebaseDatabase,
                            `games/${roomRef.current}/winner/${
                                meRef.current === "black" ? "white" : "black"
                            }`
                        )
                    );
                    set(
                        ref(firebaseDatabase, `games/${roomRef.current}/time`),
                        time
                    );
                    remove(
                        ref(
                            firebaseDatabase,
                            `games/${roomRef.current}/current`
                        )
                    );
                    remove(
                        ref(
                            firebaseDatabase,
                            `games/${roomRef.current}/players/black`
                        )
                    );
                    remove(
                        ref(
                            firebaseDatabase,
                            `games/${roomRef.current}/players/white`
                        )
                    );
                    remove(
                        ref(
                            firebaseDatabase,
                            `games/${roomRef.current}/winner/black`
                        )
                    );
                    remove(
                        ref(
                            firebaseDatabase,
                            `games/${roomRef.current}/winner/white`
                        )
                    );
                    remove(
                        ref(firebaseDatabase, `games/${roomRef.current}/time`)
                    );
                    set(
                        ref(
                            firebaseDatabase,
                            `rooms/public/${roomRef.current}`
                        ),
                        {
                            name: `${
                                firebaseAuth.currentUser.email
                                    ? firebaseAuth.currentUser.email
                                    : firebaseAuth.currentUser.uid
                            } 的房间`,
                            status: "end",
                            time,
                        } as ServerSideRoomData
                    );
                } else {
                    remove(
                        ref(
                            firebaseDatabase,
                            `games/${roomRef.current}/players/${meRef.current}`
                        )
                    );
                }
            }
        };

        window.addEventListener("beforeunload", cleanup);

        return () => {
            window.removeEventListener("beforeunload", cleanup);
            cleanup();
            const onClose = () => dialog.setOpen(false);
            const onConfirm = () => {
                remove(
                    ref(firebaseDatabase, `rooms/public/${roomRef.current}`)
                );
                onClose();
            };
            dialog.setDialog(
                "提示",
                "要删除房间吗？",
                <>
                    <Button onClick={onClose}>取消</Button>
                    <Button onClick={onConfirm}>确定</Button>
                </>,
                onClose
            );
            dialog.setOpen(true);
        };
    }, []);

    const onCreateRoom = () => {
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
            joinRoom(firebaseAuth.currentUser.uid);
        }
    };

    const joinRoom = (id: string) => {
        setCanSetRoom(false);
        dispatchState({
            type: "init",
            joinedRoom: id,
            dispatch: dispatchState,
            nextPlayer,
        });
    };

    const onPointClick = (x: number, y: number) => {
        dispatchState({
            type: "updateBoard",
            header,
            dialog,
            x,
            y,
            nextPlayer,
        });
    };

    return (
        <>
            <Collapse in={canSetRoom}>
                <List>
                    <ListItemButton
                        onClick={onCreateRoom}
                        disabled={!canSetRoom}
                    >
                        <ListItemText primary="发布" secondary="创建新房间" />
                    </ListItemButton>
                    {Object.keys(rooms).map((id) => (
                        <ListItemButton
                            onClick={() => joinRoom(id)}
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
            <Gobang board={board} onPointClick={onPointClick} size={size} />
            <Slider
                aria-label="Board Size"
                value={size}
                onChange={(_, newValue) => setSize(newValue as number)}
                valueLabelDisplay="auto"
            />
        </>
    );
};

export default OnlineGobang;
