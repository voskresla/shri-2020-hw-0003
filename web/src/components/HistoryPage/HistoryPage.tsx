import React, { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { getBuildsListFromYNDX } from '../../actions/'

import LayoutContainer from '../common/Layout/LayoutContainer'
import Header from '../common/Header/Header'
import LinkButton from '../common/LinkButton/LinkButton'
import List from '../common/List/List'
import Card from '../common/Card/Card'
import { BuildModel, StoreTypes } from '../../store'
import RunBuildPopUp from '../common/RunBuildPopUp/RunBuildPopUp'
import Button from '../common/Button/Button'

const mapStateToProps = (state: StoreTypes) => {
	return {
		builds: state.builds
	}
}
const mapDispatchToProps = {
	getBuildsListFromYNDX
}
const connector = connect(mapStateToProps, mapDispatchToProps)

export interface HistoryPageState {
	showPopup: boolean,
	offset: number,
	hideShowMore: boolean
}

type PropsFromRedux = ConnectedProps<typeof connector>

const cards = (items: BuildModel[]): React.ReactNode[] => items.map(item => <Card type="summary" item={item} />);

export class HistoryPage extends Component<PropsFromRedux, HistoryPageState> {

	state: HistoryPageState = {
		showPopup: false,
		offset: 0,
		hideShowMore: false
	}

	componentDidMount() {
		this.props.getBuildsListFromYNDX()
	}

	handleRunbuildClick = (e?:React.MouseEvent) => {
		e?.preventDefault()
		this.setState({ showPopup: true })
	}

	handleCancelPopupClick = () => {
		this.setState({ showPopup: false })
	}

	handleShowMoreClick = (e:React.MouseEvent) => {
		e.preventDefault()
		const offset = this.state.offset + 25
		this.props.getBuildsListFromYNDX(undefined, offset)
		this.setState({ offset })

		if (this.props.builds.length < offset) {
			this.setState({ hideShowMore: true })
		}
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
					id='HistoryPage'
					className={
						{
							size: "s",
							align: "center",
							'indent-b': 20,
							grow: 1
						}
					}

				>
					{!isEmpty ?
						<div
							className='initerror'
						>
							Список пуст. Возможно у Вас нет сохраненных настроек.
                        </div>
						: <>
							<List
								items={
									cards(this.props.builds)
								}
							/>
							{!this.state.hideShowMore &&
								<div style={{ marginTop: '10px' }}>
									<Button
										className={{
											size: "m",
											distribute: "center",
											view: "control"
										}}
										text="Show more"
										handleClick={(e) => this.handleShowMoreClick(e)}
									/>
								</div>
							}
						</>
					}
				</LayoutContainer>
				<RunBuildPopUp show={this.state.showPopup} cancelHandle={this.handleCancelPopupClick} />
			</>
		)
	}
}

export default connector(HistoryPage)
