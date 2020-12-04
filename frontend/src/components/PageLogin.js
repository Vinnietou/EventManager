import React, {Component} from 'react';

import './PageLogin.css';

class LoginPage extends Component{

    state = {
        isLogin: true
    };

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
                query {
                    login(
                        email: "${email}",
                        password: "${password}"
                    ) {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        };

        if(!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput: {
                            email: "${email}",
                            password: "${password}"
                        }) {
                            _id
                            email
                        }
                    }
                `
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
            console.log(resData);
        })
        .catch(err => {
            console.log(err);
        });
    }


    render(){
        return (
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
        );
    }
}

export default LoginPage;