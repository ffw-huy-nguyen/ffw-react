import React, { Component } from "react";
interface StateTypes {
  userName: string;
  password: string;
}

interface PropTypes {

}
export default class FormCC extends Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props);
    this.state = {
      userName: '',
      password: ''
    }
  }
  handleChangeUserName(e: any) {
    this.setState({userName: e.target.value})
  }

  handleChangePassword = (e: any) => {
    this.setState({password: e.target.value})
  }

  handleLogin = () => {
    console.log(this.state)
  }
  render() {
    return (
      <div>
        <div>
          <input
            type="text"
            value={this.state.userName}
            onChange={this.handleChangeUserName}
          />
        </div>
        <div>
          <input
            type="password"
            value={this.state.password}
            onChange={this.handleChangePassword}
          />
        </div>
        <div>
          <button onClick={this.handleLogin}>Login</button>
        </div>
      </div>
    );
  }
}
