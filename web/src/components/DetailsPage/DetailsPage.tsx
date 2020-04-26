import React, { Component } from 'react'
import { connect } from 'react-redux'
import Convert from 'ansi-to-html'
import { getCurrentBuildByNumber, clearCurrentBuildFlags, runRebuild } from '../../actions/index'
import { StoreTypes, BuildModel } from '../../store'
import { RouteComponentProps } from 'react-router'
import LayoutContainer from '../common/Layout/LayoutContainer'
import Header from '../common/Header/Header'
import LinkButton from '../common/LinkButton/LinkButton'
import Button from '../common/Button/Button'
import Card from '../common/Card/Card'


const convert = (log: string) => new Convert({
	newline: true,
	fg: '#000',
	escapeXML: true
}).toHtml(log)

type StateTypes = Pick<StoreTypes, 'currentBuild' | 'settings'>

interface DispatchProps {
	getCurrentBuildByNumber: (number?: string) => void // TODO: actionCreator -> void ли он возвращает?
	runRebuild: (commitHash: BuildModel['commitHash']) => void
	clearCurrentBuildFlags: () => void
}

type DetailsPageProps = StateTypes & DispatchProps & RouteComponentProps<{ number?: string }>

export class DetailsPage extends Component<DetailsPageProps> {

	componentDidMount() {
		this.props.getCurrentBuildByNumber(this.props.match.params.number)
	}

	handleRebuildClick = () => {
		console.log('fire handleRevuildClick')
		this.props.runRebuild(this.props.currentBuild.build.commitHash)

	}

	componentDidUpdate(prev: DetailsPageProps) {
		if (prev.location.pathname !== this.props.location.pathname) {
			this.props.clearCurrentBuildFlags()
			this.props.getCurrentBuildByNumber(this.props.match.params.number)
		}
	}

	componentWillUnmount() {
		this.props.clearCurrentBuildFlags()
	}

	getLogHtml(log: string) {
		return { __html: convert(log) };
	}

	render() {


		const isError = !!this.props.currentBuild.errorText || !this.props.settings.conf.repoName
		const isLoaded = !!this.props.currentBuild.build.id
		const isLogError = !!this.props.currentBuild.logErrorText
		const isLogsLoaded = !!this.props.currentBuild.buildLog

		return (
			<>
				<LayoutContainer className={{ size: "s", align: "center" }}>
					<Header isDetailsLocation={this.props.settings.conf.repoName}>
						<Button
							id='rebuild_button'
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
						<Card item={this.props.currentBuild.build} nosummary={true} />
					}
					{isError && <div className='initerror'>{this.props.currentBuild.errorText}</div>}


				</LayoutContainer>
				<LayoutContainer
					className={{
						align: "center",
						size: "m-full",

						"indent-b": "20",
						"m-indent-b": "16"
					}}
				>
					{isLoaded && <div className="log">
						<div className="log__pre log__pre_scroll">
							<div className="pre">
								{isLoaded && isLogsLoaded && !isLogError &&
									<div className='inner' dangerouslySetInnerHTML={this.getLogHtml(this.props.currentBuild.buildLog)}></div>
								}
								{!isLogsLoaded && !isLogError && <div className='initerror'>...загрузка логов</div>}
								{isLogError && <div className='initerror'>Для этой сборки еще нет логов</div>}
							</div>
						</div>
					</div>}
				</LayoutContainer>


			</>

		)
	}
}

const mapStateToProps = (state: StoreTypes): StateTypes => {
	return {
		currentBuild: state.currentBuild,
		settings: state.settings
	}
}

const mapDispatchToProps = {
	getCurrentBuildByNumber,
	clearCurrentBuildFlags,
	runRebuild
}

export default connect<StateTypes,DispatchProps,{},StoreTypes>(mapStateToProps, mapDispatchToProps)(DetailsPage)
