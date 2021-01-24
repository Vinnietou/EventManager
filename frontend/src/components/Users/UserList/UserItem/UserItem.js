import React from 'react';

import './UserItem.css';

const userItem = props => (
    <li key={props.userId} className="users__list-item">
        <div>
            <h1>{props.userId}</h1>
            <h2>{props.email}</h2>
            {props.admin && <h3>Admin</h3>}
        </div>
        <div>
            <button className="btn-update" onClick={props.onUpdate.bind(this, props.userId)}>Update</button>
            <button className="btn-delete" onClick={props.onDelete.bind(this, props.userId)}>Delete</button>    
        </div>
    </li>
);

export default userItem;