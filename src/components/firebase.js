import app from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";
const uuidv1 = require("uuid/v1");
const config = {
  apiKey: process.env.REACT_APP_MY_VARIABLE,
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

  addExercise(exercise) {
    if (!this.auth.currentUser) {
      return alert("Not authorized");
    }

    return this.db.collection(`${this.auth.currentUser.uid}`).add({
      menu: exercise.menu,
      times: exercise.times,
      date: exercise.date,
      id: uuidv1(),
    });
  }

  async deleteExercise(exercise) {
    if (!this.auth.currentUser) {
      return alert("Not authorized");
    }
    let documentID;
    await this.db
      .collection(`${this.auth.currentUser.uid}`)
      .where("id", "==", exercise.id)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          documentID = doc.id;
        });
      });

    return this.db
      .collection(`${this.auth.currentUser.uid}`)
      .doc(documentID)
      .delete();
  }

  async updateExercise(exercise) {
    if (!this.auth.currentUser) {
      return alert("Not authorized");
    }
    let documentID;
    await this.db
      .collection(`${this.auth.currentUser.uid}`)
      .where("id", "==", exercise.id)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          documentID = doc.id;
        });
      });

    return this.db
      .collection(`${this.auth.currentUser.uid}`)
      .doc(documentID)
      .update({
        menu: exercise.menu,
        times: exercise.times,
        date: exercise.date,
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
      .collection(`${this.auth.currentUser.uid}`)
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          exercises.push(doc.data());
        });
      });
    return exercises;
  }
}

export default new Firebase();
