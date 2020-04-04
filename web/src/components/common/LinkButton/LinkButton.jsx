import React, { Component } from "react";
import Button from "../Button/Button";
import { history } from "../../../utils/index";

export default class LinkButton extends Component {
	handleClick = () => {
		return this.props.clickHandle || history.push(this.props.href);
	};

	render() {
		// console.log('link button:', this.props.onClick);
		return (
			<Button
				{...this.props}
				handleClick={
					this.props.clickHandle ? this.props.clickHandle : this.handleClick
				}
			/>
		);
	}
}
