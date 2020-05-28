import React, { Component } from "react";
import { connect, ConnectedProps } from 'react-redux'
import { StoreTypes, BuildModel } from '../../../store'
import { changeLocaleAction } from '../../../actions/index'
import "./Footer.css";

import l18n from '../../../locale'

type StateTypes = Pick<StoreTypes, 'locale'>

const mapStateToProps = (state: StoreTypes): StateTypes => {
	return {
		locale: state.locale
	}
}

const mapDispatchToProps = {
	changeLocaleAction
}
const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>
type FooterProps = StateTypes & PropsFromRedux
export class Footer extends Component<FooterProps> {

	handleLocaleChange = () => {
		console.log('sss xxx', this.props.locale)	
		this.props.changeLocaleAction()
	}

	render() {
		console.log('l18n', l18n)
    return (
      <div className="footer">
        <div className="footer__content">
          <div className="footer__links">
            <a href="http://">
              <div className="text text_view_ghost text_size_s text_type_link">
                Support
              </div>
            </a>
            <a href="http://">
              <div className="text text_view_ghost text_size_s text_type_link">
								{l18n[this.props.locale.locale].Footer.Learning}
              </div>
            </a>
            {/* <a href="http://"> */}
              <div className="text text_view_ghost text_size_s text_type_link" onClick={this.handleLocaleChange}>
                Ru/En
              </div>
						{/* </a> */}
          </div>
          <div className="footer__copyright">
            <div className="text text text_size_s text_view_ghost">
              © Copyright 2020
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connector(Footer)
