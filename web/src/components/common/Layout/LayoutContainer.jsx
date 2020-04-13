import React, { Component } from "react";
import { withNaming } from "@bem-react/classname";

const className = withNaming({ e: "__", m: "_" })("layout", "container");

export default class LayoutContainer extends Component {
  render() {
    return (
      <div id={this.props.id || ''} className={className(this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}
