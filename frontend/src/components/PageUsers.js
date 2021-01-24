import React, {Component} from 'react';

import UserList from '../components/Users/UserList/UserList';
import LoginContext from '../context/login-context'
import './PageUsers.css';

class UsersPage extends Component{
    
    state = {
        isLoading: false,
        users: [],
        selectedUser: null
    } 

    static contextType = LoginContext;

    componentDidMount(){
        this.fetchUsers();
    }

    fetchUsers = () => {
        this.setState({isLoading: true});
        const requestBody = {
            query: `
                query {
                    users {
                        _id
                        email
                        admin
                    }
                }
            `
        };  

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            const users = resData.data.users;
            this.setState({users: users, isLoading: false});
            console.log(this.state.users);
        })
        .catch(err => {
            console.log(err);
            this.setState({isLoading: false});
        });
    }

    updateUserFromListHandler = userId =>{};

    deleteUserFromListHandler = userId => {
        if(!this.context.token && !this.context.admin){
            return;
        }

        this.setState({selectedUser: userId, isLoading: true});

        const selectedUserId = userId;

        const requestBody = {
            query: `
                mutation DeleteUser ($selectedId: ID!){
                    deleteUser(userId: $selectedId) {
                        _id
                    }
                }
            `,
            variables: {
                selectedId: selectedUserId
            }
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
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
            this.setState({ selectedUser: null });
            this.fetchUsers();
        })
        .catch(err => {
            console.log(err);
        });
    }

    render(){
        
        return(
            <React.Fragment>
                {this.state.isLoading ? 
                        (<div className="spinner"><p>Loading...</p></div>) : 
                        (<UserList 
                            users={this.state.users}
                            onViewUpdate={this.updateUserFromListHandler}
                            onClickDelete={this.deleteUserFromListHandler}
                        />)
                }
            </React.Fragment>
        );
    }
}

export default UsersPage;