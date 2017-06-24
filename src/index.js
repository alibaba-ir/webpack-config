import React, {Component} from "react";
import ReactDOM from "react-dom";

import "./Sass/Main";
import Application from "./Components/Application";

ReactDOM.render(<Application />, document.getElementById("root"));

// Hot Module Replacement API
if(module.hot) {
	module.hot.accept();
}
