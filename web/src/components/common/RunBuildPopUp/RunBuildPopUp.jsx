import React, { Component } from "react";
import { connect } from 'react-redux'
import { Convert } from 'ansi-to-html'

import { runRebuild, clearCurrentBuildFlags } from '../../../actions/index'

import InputGroup from "../InputGroup/InputGroup";
import Button from "../Button/Button";

import "./RunBuild.css";

const convert = (log) => new Convert({
    newline: true,
    fg: '#000',
    escapeXML: true
}).toHtml

export class RunBuild extends Component {
    state = {
        inputValue: "",
        errorText: ''
        // isValid: false
    };

    handleClose = e => {
        if (this.props.errorText) this.props.clearCurrentBuildFlags()
        e.preventDefault();
        this.props.cancelHandle()
    };

    handleInputChange = (id, value) => {
        if (this.props.errorText) this.props.clearCurrentBuildFlags()
        this.setState({ inputValue: value });
    };

    handleSubmit = (e) => {
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
                            // valid={false}
                            inputValue={this.state.inputValue}
                            handleChange={this.handleInputChange}
                            placeholder={"commit hash"}
                            renderAppend={
                                <Button
                                    // handleClick={this.handleSubmit}
                                    className={{ size: "m", distribute: "center" }}
                                    iconName={"inputclose"}
                                />
                            }
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

const mapStateToProps = (state) => {
    return {
        errorText: state.currentBuild.errorText
    }
}

const mapDispatchToProps = {
    runRebuild,
    clearCurrentBuildFlags
}

export default connect(mapStateToProps, mapDispatchToProps)(RunBuild)

