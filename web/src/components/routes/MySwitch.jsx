import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import StartPage from '../StartPage/StartPage'
import HistoryPage from '../HistoryPage/HistoryPage'
import SettingsPage from '../SettingsPage/SettingsPage'

class MySwitch extends Component {
	render() {
		const isSettings = !!this.props.isSettings
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
		isSettings: state.settings.conf.id
	}
}

export default connect(mapStateToProps)(MySwitch);
