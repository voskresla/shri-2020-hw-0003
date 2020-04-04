import React, { Component } from "react";
import { Link, Route } from 'react-router-dom'
// import Button from "./Button";
// import LinkButton from "./LinkButton";
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import api from "../../../api/schoolcicerver";
import { connect } from "react-redux";
// import { history } from "../utils/index";

import "./Header.css";

class Header extends Component {
	// handleClick = async (e) => {
	// 	console.log("fire from rebuild", this.props.currentBuild);
	// 	e.preventDefault();

	// 	// отправим коммит в билд
	// 	const { data } = await api.post(
	// 		`/builds/${this.props.currentBuild.commitHash}`
	// 	);

	// 	history.push(`/build/${data.data.buildNumber}`);
	// };
	
	render() {
		return (
			<div className="header">
				<div className="header__content header__content_distribute_betwen">
					<div className="header__title">
						<div className="text text_type_h1 text_size_xl text_view_ghost">
							<Link to="/">School CI Server</Link>
						</div>
					</div>
					<div className="header__controls">
						{this.props.children}
						{/* <Route
							exact
							path="/"
							render={() => (
								<LinkButton
									className={{
										size: "s",
										distribute: "center",
										view: "control",
									}}
									text={"Settings"}
									iconName={"settings"}
									hideMobile={true}
									href={"/settings"}
								/>
							)}
						/>
						<Route
							exact
							path="/history/(runbuild)?"
							render={() => (
								<>
									<LinkButton
										className={{
											size: "s",
											distribute: "center",
											view: "control",
										}}
										text={"Run build"}
										iconName={"run"}
										hideMobile={true}
										// TODO: куда ведет кнопка Run build ?
										href={"/history/runbuild"}
									/>
									<LinkButton
										className={{
											size: "s",
											distribute: "center",
											view: "control",
										}}
										iconName={"settings"}
										hideMobile={true}
										href={"/settings"}
									/>
								</>
							)}
						/>
						<Route
							path="/build"
							render={() => (
								<>
									<LinkButton
										className={{
											size: "s",
											distribute: "center",
											view: "control",
										}}
										// text={"Run build"}
										iconName={"rebuild"}
										hideMobile={true}
										clickHandle={(e) => this.handleClick(e)}
										// TODO: куда ведет кнопка Run build ?
										// href={"/history/runbuild"}
									/>
									<LinkButton
										className={{
											size: "s",
											distribute: "center",
											view: "control",
										}}
										iconName={"settings"}
										hideMobile={true}
										href={"/settings"}
									/>
								</>
							)}
						/> */}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	// return { currentBuild: state.currentBuild };
};

export default connect()(Header);
