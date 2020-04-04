import React, { Component } from "react";
import { cn } from "../utils/index";
import "./List.css";

const className = cn("list");

export default class List extends Component {
  render() {
    return (
      <div className="list">
        {this.props.items.map(item => (
          <div className={className("item")}>{item}</div>
        ))}
      </div>
    );
  }
}
