import React, { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { mapSettings, history, SettingsModel, Placeholder } from '../../utils'
import { saveSettingsToYNDX, clearSettingsFlags } from '../../actions'

// TODO: необработанная ошибка на сервере если пустое имя BranchName

import LayoutContainer from '../common/Layout/LayoutContainer'
import Header from '../common/Header/Header'
import Button from '../common/Button/Button'
import InputGroup from '../common/InputGroup/InputGroup'

import './SettingsPage.css'
import { StoreTypes, SettingsStoreTypes } from '../../store'

type StateTypes = Pick<SettingsStoreTypes, 'conf' | 'isSavingToYNDXError' | 'isSavedToYNDX' | 'errorText'>

interface DispatchProps {
	clearSettingsFlags: () => void
	saveSettingsToYNDX: (settings: SettingsModel) => void
}

type SettingsPageProps = StateTypes & DispatchProps 

type SettingPageState = SettingsModel & {[key:string]:string}

export class SettingsPage extends Component<SettingsPageProps, SettingPageState> {

	// REVIEW: нужен для controlledInputs + valid + posting + disabled (вроде нуджен только тут, пока не будем выносить)
	state = {
		id: "",
		repoName: "",
		buildCommand: "",
		mainBranch: "",
		period: "",
	}

	settingsForm = React.createRef<HTMLFormElement>()

	componentDidMount() {
		if (this.props.conf.repoName) this.setState({ ...this.props.conf })
	}

	componentWillUnmount() {
		this.props.clearSettingsFlags()
	}

	// TODO: но вобще должно быть не string а четкие значения из plaseholders | settingmodel
	handleInputChange = (value: string, id?: string) => {
		if (id && value !== undefined) {
			this.setState({ [id]: value });
		}
		if (this.props.errorText || this.props.isSavedToYNDX) this.props.clearSettingsFlags()
	};

	handleSave = (e: React.MouseEvent) => {
		e.preventDefault()
		this.props.clearSettingsFlags()
		if (!this.checkValidity()) return

		this.saveSettings()
	}

	handleCancel = (e: React.MouseEvent) => {
		e.preventDefault()
		history.goBack()
	}

	checkValidity() {
		document.querySelectorAll('input').forEach(e => {
			if (!e.checkValidity()) {
				e.classList.add('input_view_error')
			} else {
				e.classList.remove('input_view_error')
			}
		})

		return this.settingsForm?.current?.checkValidity()
	}

	saveSettings() {
		const settingsPayload: SettingsModel = {
			repoName: this.state.repoName,
			buildCommand: this.state.buildCommand,
			mainBranch: this.state.mainBranch,
			period: Number(this.state.period),
		}

		this.props.saveSettingsToYNDX(settingsPayload)
	}

	render() {
		return (
			<>

				<LayoutContainer className={{ size: "s", align: "center" }}>
					<Header />
				</LayoutContainer>
				<LayoutContainer id="SettingsPage" className={{ size: "s", align: "center" }}>
					<div className="grid grid_m-columns_12 grid_col-gap_full grid grid_s-columns_12">
						<div className="grid__fraction grid__fraction_m-col_7">
							<form className="form" ref={this.settingsForm}>
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
										<div key={item?.id} className="form__item form__item_indent-b_xl">
											<InputGroup
												id={item?.id}
												// NOTE: супер хак для controlledInput
												inputValue={this.state[item?.id as keyof Placeholder]} // TODO: плохо, подумай как лучше
												handleChange={this.handleInputChange}
												label={item?.label}
												placeholder={item?.placeholder}
												required={item?.required}
												pattern={item?.pattern}
												type={item?.type}
												vertical={item?.vertical}
												renderAppend={
													<Button
														handleClick={(e) => {
															e.preventDefault()
															this.handleInputChange('', item?.id)
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
										text={!this.props.isSavedToYNDX ? "Save" : "Fetching & Cloning.."}
										handleClick={this.handleSave}
										mydisabled={this.props.isSavedToYNDX}
									/>
									{/* TODO: что делает кнопка Cancel */}
									<Button
										className={{ size: "m", view: "control" }}
										text="Cancel"
										mydisabled={this.props.isSavedToYNDX}
										handleClick={this.handleCancel}
									/>
								</div>
								<div className="text text_view_ghost text_size_s">
									{this.props.isSavingToYNDXError && <span>{this.props.errorText}</span>}
									{this.props.isSavedToYNDX && <span>Сохранение настроек успешно. LINK LINK</span>}
								</div>
							</form>
						</div>
					</div>
				</LayoutContainer>

			</>
		)
	}
}

const mapStateToProps = (state: StoreTypes) => {
	return {
		conf: state.settings.conf,
		isSavingToYNDXError: state.settings.isSavingToYNDXError,
		isSavedToYNDX: state.settings.isSavedToYNDX,
		errorText: state.settings.errorText
	}
}

const mapDispatchToProps = {
	saveSettingsToYNDX,
	clearSettingsFlags
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage)
