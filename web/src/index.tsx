import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";

import { Provider } from "react-redux"; 
import * as serviceWorker from './serviceWorker';

import { history } from "./utils";
import { store } from './store'
import { init } from './actions'
import App from "./components/App";

store.dispatch(init())

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<Router history={history}>
				<App/>
			</Router>
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
