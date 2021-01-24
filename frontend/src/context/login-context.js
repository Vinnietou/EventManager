import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    admin: null,
    login: (token, userId, tokenExpiration, admin) => {},
    logout: () => {}
});