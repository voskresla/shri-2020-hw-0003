import React, { Component } from "react";
import { Link } from 'react-router-dom'
import { connect } from "react-redux";

import "./Header.css";

class Header extends Component {
	render() {
		const isDetailsLocation = !!this.props.isDetailsLocation

		return (
			<div className="header">
				<div className="header__content header__content_distribute_betwen">
					<div className="header__title">
						<div className={`text text_type_h1 text_size_xl ${!isDetailsLocation ? 'text_view_ghost' : null}`}>
							<Link to="/">
								{!isDetailsLocation ? 'School CI Server' : this.props.isDetailsLocation}
							</Link>
						</div>
					</div>
					<div className="header__controls">
						{this.props.children}
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
