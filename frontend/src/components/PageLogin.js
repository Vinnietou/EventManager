import React, {Component} from 'react';

import './PageLogin.css';
import LoginContext from '../context/login-context';

class LoginPage extends Component{

    state = {
        isLogin: true
    };

    static contextType = LoginContext;

    constructor(props){
        super(props);
        this.emailElement = React.createRef();
        this.passwordElement = React.createRef();
    }
    
    switchModeHandler = () => {
        this.setState(prevState => {
            return{isLogin: !prevState.isLogin};
        })
    };

    submitHandler = (event) => {
        event.preventDefault();
        const email = this.emailElement.current.value;
        const password = this.passwordElement.current.value;

        if(email.trim().length === 0 || password.trim().length === 0) return;

        let requestBody = {
            query: `
                query Login($loginEmail: String!, $loginPassword: String!){
                    login(
                        email: $loginEmail,
                        password: $loginPassword
                    ) {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `,
            variables: {
                loginEmail: email,
                loginPassword: password
            }
        };

        if(!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation Signup($userSubmittedEmail: String!, $userSubmittedPassword: String!) {
                        createUser(userInput: {
                            email: $userSubmittedEmail,
                            password: $userSubmittedPassword
                        }) {
                            _id
                            email
                        }
                    }
                `,
                variables: {
                    userSubmittedEmail: email,
                    userSubmittedPassword: password
                }
            };
        }

        

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            this.switchModeHandler();
            if(resData.data.login.token){
                this.context.login(
                    resData.data.login.token,
                    resData.data.login.userId,
                    resData.data.login.tokenExpiration
                )
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    render(){
        return (
        <React.Fragment>
            {this.state.isLogin ? <h1 className="login-header">Login</h1> : <h1 className="login-header">SignUp</h1>}
            <form className="login-form" onSubmit = {this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" ref={this.emailElement}/>
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordElement}/>
                </div>
                <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button type="button" onClick = {this.switchModeHandler}>
                        Switch to {this.state.isLogin ? 'Signup' : 'Login'}
                    </button>
                </div>
            </form>
        </React.Fragment>
        );
    }
}

export default LoginPage;