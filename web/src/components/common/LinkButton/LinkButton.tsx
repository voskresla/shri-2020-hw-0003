import React, { Component } from "react";
import Button, {ButtonProps} from "../Button/Button";
import { history } from "../../../utils/index";

interface LinkButtonProps {
	// TODO: пока оставляем не nullable, посмотрим где выстрелит. Если нигде - значит push(history) не нужен
	clickHandle: () => void
	href: ButtonProps['href']
}

export default class LinkButton extends Component<LinkButtonProps> {
	handleClick = () => {
		return this.props.clickHandle || this.props.href && history.push(this.props.href);
	};

	render() {
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
