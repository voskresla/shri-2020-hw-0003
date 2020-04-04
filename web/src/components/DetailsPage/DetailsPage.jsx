import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getCurrentBuildByNumber } from '../../actions/index'

import LayoutContainer from '../common/Layout/LayoutContainer.jsx'
import Header from '../common/Header/Header'
import LinkButton from '../common/LinkButton/LinkButton.jsx'
import Button from '../common/Button/Button'
import Card from '../common/Card/Card'

export class DetailsPage extends Component {

    componentDidMount() {
        // получить все по билду по номеру с нового endpoint
    }

    handleRebuildClick = () => {
        console.log('fire handleRevuildClick')
    }

    render() {
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
                <LayoutContainer className={{ size: "s", align: "center" }}>

                </LayoutContainer>
            </>

        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
    getCurrentBuildByNumber
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsPage)
