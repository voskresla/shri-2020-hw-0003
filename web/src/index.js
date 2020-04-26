import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";

import { Provider } from "react-redux";


import { history } from "./utils";
import { store } from './store'
import { getSettingsFromYNDX, init } from './actions'
import App from "./components/App";



store.dispatch(init())

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<Router history={history}>
				<App />
			</Router>
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
