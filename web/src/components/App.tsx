import React, { Component } from "react";
import { connect, ConnectedProps } from "react-redux";

import Layout from "./common/Layout/Layout";
import MySwitch from "./routes/MySwitch";
import Footer from './common/Footer/Footer'

import './app.css'
import { StoreTypes } from "../store";

const mapStateToProps = (state: StoreTypes) => {
	return { settings: state.settings }
}
const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

class App extends Component<PropsFromRedux> {
	render() {
		const isLoaded = this.props.settings.isLoaded
		const isError = this.props.settings.isError
		return (
			<div
				className="App page theme theme_color_project-default theme_size_default
    theme_space_default theme_gap_small theme_icon-size_default"
			>
				<Layout>
					{isError && <div className="initerror">Ошика сервера при инициализации. Попробуйте позже.</div>}
					{isLoaded && !isError ?
						<>
							<MySwitch />
							<Footer />
						</>
						: !isError &&
						<div className="initerror-full">
							<span>Инициализируем приложение...</span>
							(задержка выставленна на стороне сервера)
					</div>}
				</Layout>
			</div>
		);
	}
}

export default connector(App)
