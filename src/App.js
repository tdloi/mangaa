import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import SignIn from './components/SignIn';
import { useLocalStorage, useFirebaseUser } from './hooks';

import 'bulma/css/bulma.css';
import { theme } from './theme';

function App() {
  const [themeMode, setThemeMode] = useLocalStorage('theme', 'light'); // eslint-disable-line no-unused-vars
  const user = useFirebaseUser();

  return (
    <Router>
      <ThemeProvider theme={theme[themeMode]}>
        <Navbar user={user} />
      </ThemeProvider>

      <Route path="/" exact component={Home} />
      <Route path='/signin' component={SignIn} />
    </Router>
  );
}

export default App;
