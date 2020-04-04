import React, { Component } from 'react'
import { connect } from 'react-redux'
import { mapSettings } from '../../utils/index'

import LayoutContainer from '../common/Layout/LayoutContainer.jsx'
import Header from '../common/Header/Header'
import Button from '../common/Button/Button'
import InputGroup from '../common/InputGroup/InputGroup'

import './SettingsPage.css'

export class SettingsPage extends Component {

	state = {
		id: "",
		repoName: "",
		buildCommand: "",
		mainBranch: "",
		period: ""
	}

	componentDidMount() {
		if (this.props.settings) this.setState({ ...this.props.settings })
	}

	handleInputChange = (id, value) => {
		this.setState({ [id]: value });
	};

	// TODO: isValid -> + checkValid (не забудь что onChange не тригериться при fill programaticaly input value)

	render() {

		return (
			<>
				<LayoutContainer className={{ size: "s", align: "center" }}>
					<Header />
				</LayoutContainer>
				<LayoutContainer className={{ size: "s", align: "center" }}>
					<div className="grid grid_m-columns_12 grid_col-gap_full grid grid_s-columns_12">
						<div className="grid__fraction grid__fraction_m-col_7">
							<form className="form">
								<div className="form__title">
									<div className="form__header text text_type_h2 text_size_m">
										Settings
									</div>
									<div className="form__subheader text text_size_s text_view_ghost">
										Configure repository connection and synchronization settings.
									</div>
								</div>
								<div className="form__items">
									{mapSettings(this.state).map(item => (
										<div key={item.id} className="form__item form__item_indent-b_xl">
											<InputGroup
												// TODO: валидация
												// valid={!this.state[item.id]}
												id={item.id}
												// TODO: супер хак для controlledInput
												inputValue={this.state[item.id]}
												handleChange={this.handleInputChange}
												label={item.label}
												placeholder={item.placeholder}
												renderAppend={
													<Button
														handleClick={(e) => {
															e.preventDefault()
															this.handleInputChange(item.id, '')
														}}
														className={{ size: "m", distribute: "center" }}
														iconName={"inputclose"}
														iconSize={'m'}
													/>
												}
											/>
										</div>
									))}
								</div>
								<div className="form__controls">
									{/* TODO: проверять если настройки такие же то говорить и не сохранять */}
									<Button
										className={{ size: "m", view: "action" }}
										text={!this.state.isPosting ? "Save" : "Fetching & Cloning.."}
										handleClick={this.handleSubmit}
										mydisabled={this.state.isPosting}
									/>
									{/* TODO: что делает кнопка Cancel */}
									<Button
										className={{ size: "m", view: "control" }}
										text="Cancel"
										mydisabled={this.state.isPosting}
									/>
								</div>
								<div className="text text_view_ghost text_size_s">
									{/* {this.state.errorText} */}
								</div>
							</form>
						</div>
					</div>
				</LayoutContainer>
			</>
		)
	}
}

const mapStateToProps = (state) => {
	return { settings: state.settings }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage)
