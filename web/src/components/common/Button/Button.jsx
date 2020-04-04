import React, { Component } from "react";
import { cn } from "../../../utils/";

import "./Button.css";

import Icon from "../Icon/Icon.jsx";

const className = cn("button");

export default class Button extends Component {
	render() {
		const iconName = false || this.props.iconName;
		const text = false || this.props.text;
		const hideMobile = this.props.hideMobile ? "decorator hide_mobile" : "";
		const iconSize =  this.props.iconSize || 's' 

		return (
			<button
				disabled={this.props.mydisabled}
				className={className(this.props.className)}
				onClick={this.props.handleClick}
			>
				{iconName && <Icon className={{ size: iconSize  }} name={iconName}></Icon>}
				{text && <div className={`button__text ${hideMobile}`}>{text}</div>}
			</button>
		);
	}
}
