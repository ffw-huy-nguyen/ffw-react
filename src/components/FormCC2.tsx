import React, { Component } from "react";
interface StateTypes {
  userName: string;
  password: string;
}

interface PropTypes {

}
export default class FormCC2 extends Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props);
    this.state = {
      userName: '',
      password: ''
    }
  }
  handleChangeInput = (e: any) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = e.target.name;
    this.setState({
      [name]: value
    } as Pick<StateTypes, keyof StateTypes>);
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
            name="userName"
            value={this.state.userName}
            onChange={this.handleChangeInput}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChangeInput}
          />
        </div>
        <div>
          <button onClick={this.handleLogin}>Login</button>
        </div>
      </div>
    );
  }
}
