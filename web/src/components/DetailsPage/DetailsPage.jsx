import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getCurrentBuildByNumber, clearCurrentBuildFlags } from '../../actions/index'

import LayoutContainer from '../common/Layout/LayoutContainer.jsx'
import Header from '../common/Header/Header'
import LinkButton from '../common/LinkButton/LinkButton.jsx'
import Button from '../common/Button/Button'
import Card from '../common/Card/Card'

export class DetailsPage extends Component {

    componentDidMount() {
        this.props.getCurrentBuildByNumber(this.props.match.params.number)
    }

    handleRebuildClick = () => {
        console.log('fire handleRevuildClick')
    }

    componentWillUnmount() {
        this.props.clearCurrentBuildFlags()
    }

    render() {


        const isError = !!this.props.currentBuild.errorText || !this.props.settings.conf.repoName
        const isLoaded = !!this.props.currentBuild.build.id
        const isLogError = !!this.props.currentBuild.logErrorText
        const isLogsLoaded = !!this.props.currentBuild.buildLog

        return (
            <>
                <LayoutContainer className={{ size: "s", align: "center" }}>
                    <Header>
                        <Button
                            className={{
                                size: "s",
                                view: "control",
                            }}
                            text={"Rebuild"}
                            iconName={"rebuild"}
                            hideMobile={true}
                            handleClick={this.handleRebuildClick}
                        />
                        <LinkButton
                            className={{
                                size: "s",
                                view: "control",
                            }}
                            iconName={"settings"}
                            href={"/settings"}
                        />
                    </Header>
                </LayoutContainer>
                <LayoutContainer className={{
                    size: "s",
                    align: "center",
                    "indent-b": "12",
                    "m-indent-b": "16"
                }}>
                    {isLoaded && !isError &&
                        <Card item={this.props.currentBuild.build} />
                    }
                    {isError && <div class='initerror'>{this.props.currentBuild.errorText}</div>}

                    {isLoaded && <div class="log">
                        <div class="log__pre log__pre_scroll">
                            <div class="pre">
                                {isLoaded && isLogsLoaded && !isLogError &&
                                    <div class='inner'>{this.props.currentBuild.buildLog}</div>
                                }
                                {!isLogsLoaded && !isLogError && <div class='initerror'>...загрузка логов</div>}
                                {isLogError && <div class='initerror'>Для этой сборки еще нет логов</div>}
                            </div>
                        </div>
                    </div>}
                </LayoutContainer>


            </>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentBuild: state.currentBuild,
        settings: state.settings
    }
}

const mapDispatchToProps = {
    getCurrentBuildByNumber,
    clearCurrentBuildFlags
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsPage)
