import React, { Component } from "react";
import Button, {ButtonProps} from "../Button/Button";
import { history } from "../../../utils/index";
import { IconName } from "../Icon/Icon";

interface LinkButtonProps {
	// TODO: пока оставляем не nullable, посмотрим где выстрелит. Если нигде - значит push(history) не нужен
	clickHandle?: (e?:React.MouseEvent) => void
	href?: ButtonProps['href'],
	className?: { [key: string]: string | number } 
	text?: string,
	iconName?: keyof typeof IconName,
	hideMobile?: boolean
}

export default class LinkButton extends Component<LinkButtonProps> {
	handleClick = (e?: React.MouseEvent) => {
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
