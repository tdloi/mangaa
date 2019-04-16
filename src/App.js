import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import SignIn from './components/SignIn';
import MangaInfo from './components/MangaInfo';
import MangaCreate from './components/MangaCreate';
import Chapter from './components/Chapter';
import ChapterCreate from './components/ChapterCreate';
import { NotFound } from './components/Error';
import { useLocalStorage, useFirebaseUser } from './hooks';

import { theme } from './theme';

function App() {
  const [themeMode, setThemeMode] = useLocalStorage('theme', 'light'); // eslint-disable-line no-unused-vars
  const user = useFirebaseUser();

  return (
    <Router>
      <ThemeProvider theme={theme[themeMode]}>
        <Navbar user={user} />
      </ThemeProvider>

      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signin" component={SignIn} />

        <Route path="/manga/new" exact component={MangaCreate} />
        <Route path="/manga/new/:id" component={ChapterCreate} />
        <Route path="/manga/:id" exact component={MangaInfo} />
        <Route path="/manga/:id/:name" component={MangaInfo} />

        <Route path="/chapter/:id" component={Chapter} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
