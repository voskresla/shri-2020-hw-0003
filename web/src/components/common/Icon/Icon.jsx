import React, { Component } from "react";
import { cn } from "../../../utils";
import { icons } from "./asset";

import "./Icon.css";

const className = cn("icon");

export default class Icon extends Component {
  render() {
    return (
      <div className={className(this.props.className)}>
        {this.props.type
          ? icons[this.props.type].render()
          : icons[this.props.name].render()}
      </div>
    );
  }
}
