import firebase from 'firebase/compat/app';  // compat 모듈 사용
import 'firebase/compat/database';  // Realtime Database 사용

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDMXqyUZD6Pj0y0TLh43cgKyZTe4Jf7Xz4",
  authDomain: "football-park.firebaseapp.com",
  databaseURL: "https://football-park-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "football-park",
  storageBucket: "football-park.appspot.com",
  messagingSenderId: "279491831076",
  appId: "1:279491831076:web:0a80e9b712a1e4515bffb1",
  measurementId: "G-CVM6SJBN1C"
};

// Firebase 초기화
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();  // Realtime Database 접근
export { database };