import React from 'react';
import firebase from '../../firebase';
import NavbarPure from './NavbarPure';

export default function Navbar({ user }) {
  return <NavbarPure user={user} signOut={() => firebase.auth().signOut()} />;
}
