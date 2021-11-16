import React from 'react';

const Layout = ({ children }) => {
    return (
        <div>
            <h1>Layout up</h1>
            {children}
            <h1>Layout down</h1>
        </div>
    )
}

export default Layout;