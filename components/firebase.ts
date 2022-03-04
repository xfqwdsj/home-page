import {initializeApp} from "firebase/app";
import {getDatabase} from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyARtphlxOTWb2Gpw_v-WXTeoZycygLkzLY",
    authDomain: "parabolic-clock-343006.firebaseapp.com",
    databaseURL:
        "https://parabolic-clock-343006-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "parabolic-clock-343006",
    storageBucket: "parabolic-clock-343006.appspot.com",
    messagingSenderId: "3147281179",
    appId: "1:3147281179:web:e5aca9f46100847cadd9be",
    measurementId: "G-W6Z1KYLLDN",
};

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDatabase = getDatabase(firebaseApp);