import React, { Component } from "react";
import "./Footer.css";

export default class Footer extends Component {
  render() {
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
                Learning
              </div>
            </a>
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
