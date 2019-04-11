import { useState, useEffect } from 'react';
import firebase from '../firebase';

export default function useFirebaseIdToken(user) {
  const [idToken, setIdToken] = useState(null);

  useEffect(() => {
    try {
      firebase
        .auth()
        .currentUser.getIdToken(true)
        .then(firebaseIdToken => setIdToken(firebaseIdToken));
    } catch (error) {
      setIdToken(null);
    }
  }, [idToken, user]);

  return idToken;
}
