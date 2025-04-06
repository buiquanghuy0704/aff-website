import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

const firebaseConfig = {
  apiKey: "AIzaSyCFzQcwQmF6c8FJzP4v1w7v_pjwY_vrE4E",
  authDomain: "pomodoro-9d4d9.firebaseapp.com",
  databaseURL: "https://pomodoro-9d4d9-default-rtdb.firebaseio.com",
  projectId: "pomodoro-9d4d9",
  storageBucket: "pomodoro-9d4d9.firebasestorage.app",
  messagingSenderId: "1043958193379",
  appId: "1:1043958193379:web:7ab9151118bfe73c41b9d6",
  measurementId: "G-QZQ2GF9VGY"
}

// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// export {database, app}

firebase.initializeApp(firebaseConfig)
const dataRef = firebase.database()

export { dataRef }

