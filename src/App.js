import React from 'react'
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';

import Routes from './Routes'
import {ProvideAuth} from './use-auth.js'

function App() {

  return (
    <>
    <CssBaseline />
    <ProvideAuth>
      <Routes />
    </ProvideAuth>
    </>
  );
}

export default App;
