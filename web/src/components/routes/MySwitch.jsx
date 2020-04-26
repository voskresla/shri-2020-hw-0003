import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import StartPage from '../StartPage/StartPage'
import HistoryPage from '../HistoryPage/HistoryPage'
import SettingsPage from '../SettingsPage/SettingsPage'
import DetailsPage from '../DetailsPage/DetailsPage'

class MySwitch extends Component {
	render() {
		const isSettings = !!this.props.isSettings
		return (
			<Switch>
				<Route exact path="/" component={!isSettings ? StartPage : HistoryPage} />
				<Route path="/settings" component={SettingsPage} />
				{/* TODO: /build/id 
					сделаем еще один endpoint для поиска по номеру на стороне сервера
					все равно ходить за свежей инфой всегда. 
				*/}
				<Route path="/build/:number" component={DetailsPage} />
			</Switch>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isSettings: state.settings.conf.repoName
	}
}

export default connect(mapStateToProps)(MySwitch);
