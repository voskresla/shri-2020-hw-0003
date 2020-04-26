import React, { Component } from "react";
import { connect, ConnectedProps } from 'react-redux'

import { runRebuild, clearCurrentBuildFlags } from '../../../actions/index'

import InputGroup from "../InputGroup/InputGroup";
import Button from "../Button/Button";

import "./RunBuild.css";
import { StoreTypes,BuildModel } from "../../../store";

const mapStateToProps = (state:StoreTypes) => {
	return {
		errorText: state.currentBuild.errorText
    }
}

interface DispatchProps {
	clearCurrentBuildFlags: () => void
	runRebuild: (commitHash: BuildModel['commitHash']) => void
}

const mapDispatchToProps:DispatchProps = {
    runRebuild,
    clearCurrentBuildFlags
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

interface RunBuildOwnProps {
	cancelHandle: () => void
	show: boolean
}

export type RunBuildProps = PropsFromRedux & RunBuildOwnProps

export class RunBuild extends Component<RunBuildProps> {
    state = {
        inputValue: "",
        errorText: ''
        // isValid: false
    };

    handleClose = (e: React.MouseEvent) => {
        if (this.props.errorText) this.props.clearCurrentBuildFlags()
        e.preventDefault();
        this.props.cancelHandle()
    };

    handleInputChange = (id: string, value: string) => {
        if (this.props.errorText) this.props.clearCurrentBuildFlags()
        this.setState({ inputValue: value });
    };

    handleSubmit = (e: React.MouseEvent) => {
        if (this.props.errorText) this.props.clearCurrentBuildFlags()
        e.preventDefault();
        this.props.runRebuild(this.state.inputValue)

    };

    render() {
        return (
            <div className={this.props.show ? "modal" : "hide"}>
                <div className="modal__container">
                    <div className='text text_type_h1 text_size_m'>
                        New build
                    </div>
                    <div className='text text_type_h2 text_size_s'>
                        Enter the commit hash wich you want to build
                    </div>
                    <div className="modal__input">
                        <InputGroup
                            inputValue={this.state.inputValue}
                            handleChange={this.handleInputChange}
                            placeholder={"commit hash"}
                            vertical={true}
                        />
                        <span className={'text text_size_s text_view_ghost'}>{this.props.errorText}</span>
                    </div>
                    <div className="modal__controls">
                        <Button
                            className={{
                                size: "m",
                                distribute: "center",
                                view: "action"
                            }}
                            text="Run Build"
                            handleClick={this.handleSubmit}
                        />
                        <Button
                            className={{
                                size: "m",
                                distribute: "center",
                                view: "control"
                            }}
                            text="Cancel"
                            handleClick={this.handleClose}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connector(RunBuild)

