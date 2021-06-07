import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Route} from "react-router-dom";
import './styles/global.css';

import Login from "./pages/Login";
import Setups from "./pages/Setups";
import Cars from "./pages/Cars";
import Classes from "./pages/Classes";
import Tracks from "./pages/Tracks";
import Games from "./pages/Games";
import User from "./pages/User";
import Settings from "./pages/Settings";

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Route exact path="/">
                <Setups/>
            </Route>
            <Route path="/login">
                <Login/>
            </Route>

            <Route path="/cars">
                <Cars/>
            </Route>
            <Route path="/classes">
                <Classes/>
            </Route>
            <Route path="/tracks">
                <Tracks/>
            </Route>
            <Route path="/games">
                <Games/>
            </Route>
            <Route path="/User">
                <User/>
            </Route>
            <Route path="/Settings">
                <Settings/>
            </Route>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);
