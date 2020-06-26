import React from 'react';
import 'materialize-css'
import {BrowserRouter as Router}  from 'react-router-dom'
import { useRoutes } from './routes';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';

function App() {
  const {token, login, logout, userID} = useAuth()
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated)
  return (
    <AuthContext.Provider value={{
      token, login, logout, userID, isAuthenticated
    }}>
      <Router>
        <div className="container">
          <h1>{routes}</h1>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
