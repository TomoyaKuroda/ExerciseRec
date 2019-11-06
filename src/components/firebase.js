import app from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";
const uuidv1 = require("uuid/v1");
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "exerciserec.firebaseapp.com",
  databaseURL: "https://exerciserec.firebaseio.com",
  projectId: "exerciserec",
  storageBucket: "exerciserec.appspot.com",
  messagingSenderId: "943189736074",
  appId: "1:943189736074:web:7cef65175d0b7583a08b73",
};
class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  async register(name, email, password) {
    await this.auth.createUserWithEmailAndPassword(email, password);
    return this.auth.currentUser.updateProfile({
      displayName: name,
    });
  }

  

   deleteExercise(exercise) {
    if (!this.auth.currentUser) {
      return alert("Not authorized");
    }
   
    return this.db
    .collection('users')
      .doc(`${this.auth.currentUser.uid}`)
      .collection('exercises')
      .doc(exercise.id)
      .delete();
  }

    addExercise(exercise) {
      if (!this.auth.currentUser) {
        return alert("Not authorized");
      }

      let day = new Date(exercise.date);

      return this.db.collection('users').doc(`${this.auth.currentUser.uid}`)
      .collection('exercises')
      .add({
        menu: exercise.menu,
        times: exercise.times,
        date: `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()}`,
      });


    // try {
    //   await firebase.addExercise({
    //     menu: menu,
    //     times: times,
    //     date: `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()}`
    //   });
    //   await firebase.getCurrentUserExercises().then(setExercises);
    // } catch (error) {
    //   alert(error.message);
    // }
  }

   updateExercise(exercise) {
    if (!this.auth.currentUser) {
      return alert("Not authorized");
    }
    let day = new Date(exercise.date);

    return this.db
    .collection('users')
      .doc(`${this.auth.currentUser.uid}`)
      .collection('exercises')
      .doc(exercise.id)
      .update({
        menu: exercise.menu,
        times: exercise.times,
        date: `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()}`,
      });
  }

  isInitialized() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve);
    });
  }

  getCurrentUsername() {
    return this.auth.currentUser && this.auth.currentUser.displayName;
  }

  async getCurrentUserExercises() {
    const exercises = [];
    await this.db
    .collection('users')
      .doc(`${this.auth.currentUser.uid}`)
      .collection('exercises')
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          let exercise = doc.data()
          exercise.id = doc.id
          exercises.push(exercise);
        });
      });
    return exercises;
  }
}



export default new Firebase();
