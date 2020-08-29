import firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCxa_nqdeOgwj-mDz6erx18vf-xmjYIkNc",
  authDomain: "rebecca-be7f7.firebaseapp.com",
  databaseURL: "https://rebecca-be7f7.firebaseio.com",
  projectId: "rebecca-be7f7",
  storageBucket: "rebecca-be7f7.appspot.com",
  messagingSenderId: "22312289291",
  appId: "1:22312289291:web:109104fab0dacd68f6730e",
};

class Fire {
  constructor(callback) {
    this.init(callback)
  }

  init(callback) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        callback(null, user)
      } else {
        firebase
          .auth()
          .signInAnonymously()
          .catch(error => {
            callback(error)
          })
      }
    })
  }

  getLists(callback) {
    let ref = this.ref.orderBy("name")
    
    this.unsubscribe = ref.onSnapshot(snapshot => {
      lists = []

      snapshot.forEach(doc => {
        lists.push({id: doc.id, ...doc.data()})
      })

      callback(lists)
    })
  }

  addList(list) {
    let ref = this.ref

    ref.add(list)
  }

  updateList(list) {
    let ref = this.ref

    ref.doc(list.id).update(list)
  }

  get userId() {
    return firebase.auth().currentUser.uid
  }

  get ref() {
    return firebase
      .firestore()
      .collection("users")
      .doc(this.userId)
      .collection("lists")
  }

  detach() {
    this.unsubscribe()
  }
}

export default Fire; 