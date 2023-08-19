import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyB46nh-Bvr_6mQ619e9iy0ddiV1BDU_HX8",
    authDomain: "daily-moments-f49d5.firebaseapp.com",
    projectId: "daily-moments-f49d5",
    storageBucket: "daily-moments-f49d5.appspot.com",
    messagingSenderId: "56225954545",
    appId: "1:56225954545:web:98757d2e53116261ce0750"
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export const firestore = app.firestore();
export const storage = app.storage();