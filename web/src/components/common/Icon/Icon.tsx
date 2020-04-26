import React, { Component } from "react";
import { cn } from "../../../utils";
import { icons } from "./asset";

import "./Icon.css";

const className = cn("icon");

export enum IconType {
	Success = "success",
	InProgress = "warning",
	Fail =  "error",
	Waiting = "warning",
	Canceled = "error"
}

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
	m = 'm',
}

// TODO: внезапно type используется одинаково с name -> переделать, оставить один проп
interface IconProps {
	className: { size?: string, view?: IconType }
	type?: IconType
	name?: keyof typeof IconName
}

export default class Icon extends Component<IconProps> {
  render() {
    return (
      <div className={className(this.props.className)}>
			{this.props.type
			// @ts-ignore
			? icons[this.props.type].render()
			// @ts-ignore
          	: icons[this.props.name].render()}
      </div>
    );
  }
}
