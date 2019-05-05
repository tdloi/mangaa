import { useState, useEffect } from 'react';
import firebase from '../firebase';

export default function useFirebaseUser() {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);

        firebase.auth().currentUser
        .getIdToken(true)
        .then(firebaseIdToken => setIdToken(firebaseIdToken));
      } else {
        setUser(null)
        setIdToken(null)
      }
    })
  }, [user])

  return [user, idToken];
}
