import React, { Component } from "react";
import { connect } from "react-redux";

import api from '../api/schoolcicerver'
import { saveSettings } from "../actions";

import Layout from "./common/Layout/Layout";
import MySwitch from "./routes/MySwitch";
import Loader from './common/Loader/Loader'
import Footer from './common/Footer/Footer'

import './app.css'

class App extends Component {

	state = {
		isInitialized: false,
		isError: false
	}

	componentDidMount() {
		this.initialize()
	}

	initialize = async () => {
		try {
			const settings = await api.get('/settings')

			this.props.saveSettings(settings.data)
			this.setState({ isInitialized: true })
		} catch (e) {
			this.setState({ isError: true })
		}
	}

	render() {
		return (
			<div
				className="App page theme theme_color_project-default theme_size_default
    theme_space_default theme_gap_small theme_icon-size_default"
			>
				<Layout>
					{this.state.isInitialized ? <MySwitch /> : <Loader />}
					{this.state.isError && <div>Ошика сервера при инициализации. Попробуйте позже.</div>}
					{this.state.isInitialized && <Footer />}
				</Layout>
				{/* <Layout>
          <LayoutContainer className={{ size: "s", align: "center" }}>
            <Header />
          </LayoutContainer>
          <Myswitch />
          <Footer />
        </Layout> */}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { settings: state.settings }
}

const mapDispatchToProps = {
	saveSettings
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
