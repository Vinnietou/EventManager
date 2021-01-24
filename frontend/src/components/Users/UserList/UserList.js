import React from 'react';

import UserItem from './UserItem/UserItem';
import './UserList.css';

const userList = props => {
    const users = props.users.map(
        
        user => {
            return (
                <UserItem 
                    key={user._id}
                    userId={user._id}
                    email={user.email}
                    admin={user.admin}
                    onUpdate={props.onViewUpdate}
                    onDelete={props.onClickDelete}
                />
            )
        }
    );

    return (<ul className="user__list">
            {users}
        </ul>);

}

export default userList;