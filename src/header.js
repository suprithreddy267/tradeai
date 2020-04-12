import React, { Component } from "react";
import { Link } from "react-router-dom";
 
class Header extends Component {
  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-dark bg-dark mb-3">
          <Link to="/"><h1>Header component<span className="badge badge-secondary">{this.props.totalItems}</span></h1></Link>
        </nav>
      </React.Fragment>
    );
  }
}
 
export default Header;