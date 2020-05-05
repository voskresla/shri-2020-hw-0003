import React, { Component, ReactType } from "react";
import { withNaming, ClassNameInitilizer, ClassNameFormatter } from "@bem-react/classname";

const className = withNaming({ e: "__", m: "_" })("layout", "container");

interface LayoutContainerProps {
	id?: string
	className: { [key:string]: string | number | boolean } // TODO: не нравиться. Разберись уже с className
}

export default class LayoutContainer extends Component<LayoutContainerProps> {
  render() {
    return (
      <div id={this.props.id || ''} className={className(this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}
