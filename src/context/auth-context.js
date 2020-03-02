import React from 'react';

export default React.createContext({
    token: null,
    user_id: null,
    login: (user_id, token) => {},
    logout: () => {}
});