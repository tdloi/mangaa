import { useState, useEffect } from 'react';
import firebase from '../firebase';

export default function useFirebaseUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => setUser(user))
  }, [user])

  return user;
}
