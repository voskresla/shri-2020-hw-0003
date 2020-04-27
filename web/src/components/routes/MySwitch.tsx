import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";

import StartPage from '../StartPage/StartPage'
import HistoryPage from '../HistoryPage/HistoryPage'
import SettingsPage from '../SettingsPage/SettingsPage'
import DetailsPage from '../DetailsPage/DetailsPage'
import { StoreTypes } from "../../store";

const mapStateToProps = (state: StoreTypes) => {
	return {
		isSettings: state.settings.conf.repoName
	}
}

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

class MySwitch extends Component<PropsFromRedux> {
	render() {
		const isSettings = !!this.props.isSettings
		return (
			<Switch>
				<Route exact path="/" component={!isSettings ? StartPage : HistoryPage} />
				<Route path="/settings" component={SettingsPage} />
				<Route path="/build/:number" component={DetailsPage} />
			</Switch>
		);
	}
}

export default connector(MySwitch);
