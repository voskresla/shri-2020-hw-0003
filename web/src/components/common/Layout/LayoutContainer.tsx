import React, { Component, ReactType } from "react";
import { withNaming, ClassNameInitilizer, ClassNameFormatter } from "@bem-react/classname";

const className = withNaming({ e: "__", m: "_" })("layout", "container");

interface LayoutContainerProps {
	id: string
	myClassName: ReturnType<typeof className>
}

export default class LayoutContainer extends Component<LayoutContainerProps> {
  render() {
    return (
      <div id={this.props.id || ''} className={className(this.props.myClassName)}>
        {this.props.children}
      </div>
    );
  }
}
