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
		const inputclass = `input input_size_m ${this.props.vertical ? 'input_width_full' : 'input_width_52 text_right'} input_shape_append-right text text_size_13_15 ${
			this.props.valid ? "input_view_error" : ""
			}`;
		return (
			<div className={`
				input__group ${this.props.vertical ? 'input__group_vertical' : null} 
				${this.props.required ? 'input__group_required' : null} 
				`}>
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
					{this.props.renderAppend && this.props.vertical && (
						<div className="input__controls-append">{this.props.renderAppend}</div>
					)}

				</div>
				{!this.props.vertical &&
					<div class='tex text_size_s text_view_dark' style={{ 'margin-left': '8px' }}>
						minutes
			</div>
				}
			</div>
		);
	}
}
