import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {NotFoundComponent} from "./components/not-found/not-found-component";
import {AuthorizationComponent} from "./components/authorization/authorization-component";
import Admin from "./components/admin/admin-component";
import UserComponent from "./components/user/user-component";

import '@fontsource/roboto/400.css';

const SET = require("./redux/actions");
const redux = require('redux');
const Provider = require('react-redux').Provider;
const reducer = require('./redux/reducers');
const store = redux.createStore(reducer);

store.dispatch({
  type: SET,
  state: {
    users: null,
    settings: null,
    stocks: null
  }
})

class App extends Component {
  render() {
    return (
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<AuthorizationComponent/>}/>
              <Route path='/admin' element={<Admin/>}/>
              <Route path='/user/*' element={<UserComponent/>}/>
              <Route path="*" element={<NotFoundComponent/>}/>
            </Routes>
          </BrowserRouter>
        </Provider>
    )
  }
}

export default App;
