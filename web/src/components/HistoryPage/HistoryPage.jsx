import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getBuildsListFromYNDX } from '../../actions/'

import LayoutContainer from '../common/Layout/LayoutContainer.jsx'
import Header from '../common/Header/Header'
import LinkButton from '../common/LinkButton/LinkButton.jsx'
import List from '../common/List/List'
import Card from '../common/Card/Card'

const cards = items => items.map(item => <Card type="summary" item={item} />);

export class HistoryPage extends Component {

    componentDidMount() {
        this.props.getBuildsFromYNDX()
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
                            href={"/runbuild"}
                        />
                        <LinkButton
                            className={{
                                size: "s",
                                view: "control",
                            }}
                            // text={"Settings"}
                            iconName={"settings"}
                            // hideMobile={true}
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
                    {/* {!isEmpty ?
                        <div
                            class='initerror'
                        >
                            Список пуст. Возможно у Вас нет сохраненных настроек. LINK
                        </div>
                        : <List
                            items={
                                cards(this.props.builds)
                            }
                        />
                    } */}
                    <List
                        items={
                            cards(this.props.builds)
                        }
                    />
                </LayoutContainer>
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
