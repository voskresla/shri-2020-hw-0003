import React, { Component } from "react";
import { cn } from "../../../utils";
import "./List.css";

const className = cn("list");

// export interface ListProps {
// 	items: 
// }

export default class List extends Component {
	render() {
		return (
			<div className="list">
				{this.props.items.map((item, i) => (
					<div key={i} className={className("item")}>{item}</div>
				))}
			</div>
		);
	}
}
