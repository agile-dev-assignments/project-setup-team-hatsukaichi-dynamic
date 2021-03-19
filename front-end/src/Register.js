import './Register.css';
import React, { Component } from "react";
import { Link } from 'react-router-dom';

class Register extends Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            email: "",
            password: "",
            passwordconfirm: "",
            firstname: "",
            lastname: "",
            errorMsg: "",

        }
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value })
    }

    submit(e) {
        
    }

    render() {
        return(

            <div>
             

                <div className="login">
                    <div className="form">
                        <form className="register-form" onSubmit={(e) => {this.submit();  e.preventDefault(); }}>
                            <br />
                            <div className="error">{this.state.errorMsg}</div>
                            <div style={{float: 'left'}}>
                            <input autoFocus={true} type="text" name="firstname" placeholder="first name" size={10} value={this.state.firstname} onChange={this.handleChange} required />
                            </div>
                            <div style={{float: 'right'}}>
                            <input type="text" name="lastname" placeholder="last name" size={10} value={this.state.lastname} onChange={this.handleChange} required />
                            </div>
                            <input type="email" name="email" placeholder="email" value={this.state.email} onChange={this.handleChange} required />
                            <input type="password" name="password" placeholder="create a password" value={this.state.password} onChange={this.handleChange} required />
                            <input type="password" name="passwordconfirm" placeholder="confirm password" value={this.state.passwordconfirm} onChange={this.handleChange} required />
                            <button type="submit">create account</button>
                            <p className="message">Already registered? <Link to="/login">Sign In</Link></p>
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;