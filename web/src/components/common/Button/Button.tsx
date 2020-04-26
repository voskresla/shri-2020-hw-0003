import React, { Component } from "react";
import { cn } from "../../../utils";

import "./Button.css";

import Icon from "../Icon/Icon";
import { IconName, IconSize } from '../Icon/Icon'
import { ClassNameFormatter } from "@bem-react/classname";

const className = cn("button");

export interface ButtonProps {
	id?: string
	iconName?: keyof typeof IconName
	text?: string
	hideMobile?: boolean
	iconSize?: keyof typeof IconSize
	mydisabled?: boolean
	className?: ReturnType<ClassNameFormatter>
	href?: HTMLHyperlinkElementUtils['href']
	handleClick: () => void
}

export default class Button extends Component<ButtonProps> {
	render() {
		const iconName = false || this.props.iconName;
		const text = false || this.props.text;
		const hideMobile = this.props.hideMobile ? "decorator hide_mobile" : "";
		const iconSize: keyof typeof IconSize = this.props.iconSize || 's'

		return (
			<button
				type='button'
				id={this.props.id || iconName}
				disabled={this.props.mydisabled}
				className={className(this.props.className)}
				onClick={this.props.handleClick}
			>
				{iconName && <Icon myClassName={{ size: iconSize }} name={iconName}></Icon>}
				{text && <div className={`button__text ${hideMobile}`}>{text}</div>}
			</button>
		);
	}
}