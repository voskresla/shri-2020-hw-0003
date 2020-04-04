import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import StartPage from '../StartPage/StartPage'
import HistoryPage from '../HistoryPage/HistoryPage'
import SettingsPage from '../SettingsPage/SettingsPage'
// import LayoutContainer from "../components/LayoutContainer";
// import BuildHistory from "../components/BulidHistory";
// import Settings from "../components/Settings";
// import Start from "../components/Start";
// import RunBuild from "../components/RunBuild";
// import BuildLog from "../components/BuildLog";

// import { saveSettings, getSettingsFromYNDX } from "../actions/index";
// import { history } from "../utils/index";

// const isSettingsCached = settings =>
//   Object.keys(settings).every(key => settings[key] !== "");

class MySwitch extends Component {
	render() {
		const isSettings = this.props.settings ? true : false

		return (
			<Switch>
				<Route exact path="/" component={!isSettings ? StartPage : HistoryPage} />
				<Route path="/settings" component={SettingsPage} />
				<Route path="/history" component={HistoryPage} />
			</Switch>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		settings: state.settings
	}
}

export default connect(mapStateToProps)(MySwitch);
