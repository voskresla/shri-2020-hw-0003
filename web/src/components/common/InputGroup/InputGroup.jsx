import React, { Component } from "react";
import "./InputGroup.css";
import { parseWithOptions } from "date-fns/fp";

export default class InputGroup extends Component {
	handleChange = e => {
		const id = this.props.id;
		const value = e.target.value;

		this.props.handleChange(id, value);
	};

	render() {
		const inputclass = `input input_size_m input_width_full input_shape_append-right text text_size_13_15 ${
			this.props.valid ? "input_view_error" : ""
			}`;
		return (
			<div className="input__group input__group_vertical">
				<label htmlFor="command" className="input__label text text_size_s text_type_h2">
					{this.props.label}
				</label>
				<div className="input__controls">
					<input
						value={this.props.inputValue}
						id={this.props.id}
						type={this.props.type || 'text'}
						onChange={this.handleChange}
						placeholder={this.props.placeholder}
						className={inputclass}
						required={this.props.required}
						pattern={this.props.pattern}
					/>
					{this.props.renderAppend && (
						<div className="input__controls-append">{this.props.renderAppend}</div>
					)}
				</div>
			</div>
		);
	}
}
