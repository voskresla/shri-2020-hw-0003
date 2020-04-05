import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getBuildsListFromYNDX } from '../../actions/'

import LayoutContainer from '../common/Layout/LayoutContainer.jsx'
import Header from '../common/Header/Header'
import LinkButton from '../common/LinkButton/LinkButton.jsx'
import List from '../common/List/List'
import Card from '../common/Card/Card'
import RunBuildPopUp from '../common/RunBuildPopUp/RunBuildPopUp'

const cards = items => items.map(item => <Card type="summary" item={item} />);

export class HistoryPage extends Component {

    state = {
        showPopup: false
    }

    componentDidMount() {
        this.props.getBuildsFromYNDX()
    }

    handleRunbuildClick = (e) => {
        e.preventDefault()
        this.setState({ showPopup: true })
    }

    handleCancelPopupClick = () => {
        this.setState({ showPopup: false })
    }

    render() {
        const isEmpty = !!this.props.builds.length
        return (
            <>
                <LayoutContainer className={{ size: "s", align: "center" }}>
                    <Header>
                        <LinkButton
                            className={{
                                size: "s",
                                view: "control",
                            }}
                            text={"Run build"}
                            iconName={"run"}
                            hideMobile={true}
                            clickHandle={(e) => this.handleRunbuildClick(e)}
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
                <LayoutContainer
                    className={
                        {
                            size: "s",
                            align: "center"
                        }
                    }
                >
                    {!isEmpty ?
                        <div
                            className='initerror'
                        >
                            Список пуст. Возможно у Вас нет сохраненных настроек. LINK
                        </div>
                        : <List
                            items={
                                cards(this.props.builds)
                            }
                        />
                    }
                </LayoutContainer>
                <RunBuildPopUp show={this.state.showPopup} cancelHandle={this.handleCancelPopupClick} />
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        builds: state.builds
    }
}

const mapDispatchToProps = {
    getBuildsFromYNDX: getBuildsListFromYNDX
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryPage)
