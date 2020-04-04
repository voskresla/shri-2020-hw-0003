import React, { Component } from "react";
import { cn } from "../../../utils";
import "./Layout.css";

const classNames = cn("layout");

export default class Layout extends Component {
	render() {
		return (
			<div className={classNames({'v-ratio':'1-full-1'})}>
				{this.props.children}
			</div>
		);
	}
}
