import React, { useEffect } from 'react';

const LogoutSuccess = () => {

    useEffect(() => {
        window.scrollTo(0,0)
      }, [])

    return (
        <div>This is the logout success screen.</div>
    )
}

export default LogoutSuccess