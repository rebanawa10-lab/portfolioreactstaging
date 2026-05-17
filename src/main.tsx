// file:    src/main.tsx


import './index.css'
import "./styles/styles/table.css" // CRUD To do
import "./styles/styles/datagridform.css"; // datagrid form
import "./styles/styles/datagridtable.css"; // datagrid table

import { Provider } from "react-redux";
import { store } from "./store/store";

// import React from "react";
import ReactDOM from "react-dom/client";
import App from './App'

ReactDOM.createRoot(document.getElementById("root")!).render(

  <Provider store={store}>
    <App />
  </Provider>

  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>

);

