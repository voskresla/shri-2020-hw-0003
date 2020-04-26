import React, { Component } from "react";
import { cn } from "../../../utils";
import { icons } from "./asset";

import "./Icon.css";

const className = cn("icon");

export enum IconName {
	calendar = 'calendar',
	clock = 'clock',
	commit = 'commit',
	error = 'error',
	inputclose = 'inputclose',
	rebuild = 'rebuild',
	run = 'run',
	settings = 'settings',
	spinner = 'spinner',
	success = 'success',
	user = 'user',
	warning = 'warning',
}

export enum IconSize {
	s = 's',
}

// TODO: внезапно type используется одинаково с name -> переделать, оставить один проп
interface IconProps {
	myClassName: { size?: string, view?: string }
	// TODO: сейчас оставили чтобы замигало что нет type и name
	type?: keyof typeof IconName
	name: keyof typeof IconName
}

export default class Icon extends Component<IconProps> {
  render() {
    return (
      <div className={className(this.props.myClassName)}>
			{this.props.type
			// @ts-ignore
			? icons[this.props.type].render()
			// @ts-ignore
          	: icons[this.props.name].render()}
      </div>
    );
  }
}
