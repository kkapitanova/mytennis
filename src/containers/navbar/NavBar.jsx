import React, { useState, useEffect } from 'react'
import { handleLogout } from '../../utils/helpers';

//router
import {
    NavLink,
    Link,
    useHistory,
    useLocation,
} from "react-router-dom";

// styles
import './NavBar.scss'
// import './topnav.scss'

// material imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

import logo from '../../assets/images/logo.png'

// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
    
const NavBar = ({ unauthRoutes, authRoutes, unauthRouteLast }) => {
    const [expanded, setExpanded] = useState(false);
    const history = useHistory();
    const location = useLocation();
    const [loggedIn, setLoggedIn] = useState(false)
    const userData = JSON.parse(localStorage.getItem('userData')) || {} // TODO: replace with function that fetches data from firebase

    const expandMenu = () => {

        const navbar = document.getElementById("navbar");

        if (navbar.className === "navbar") {
            navbar.classList.add("responsive")
            
        } else {
            navbar.classList.remove("responsive")
        }

        setExpanded(!expanded)
    }

    const onLogout = () => {
        handleLogout()
        history.push('/login')
    }

    useEffect(() => {
        const authToken = sessionStorage.getItem('Auth Token')

        if (authToken) {
            setLoggedIn(true)

            if (!userData.firstName) {
                history.push('/profile')
            }
            // navigate('/home')
        }

        if (!authToken) {
            setLoggedIn(false)
            // navigate('/login')
        }
    }, [location.pathname, history])

    return (
        <>
            <div className="navbar" id="navbar">
                <div className='logo-wrapper flex align-center'>
                    <img src={logo} height={40} alt=""></img>
                    <Link to={"/"} className="link-wrapper">MYTennis</Link>
                </div>                
                <div className="flex links-wrapper">
                    {unauthRoutes && unauthRoutes.map((route, index) => (
                        <div className="flex-column" key={index}>
                            <NavLink
                                key={route.path}
                                exact 
                                to={route.path}
                                activeClassName="is-active"
                                className="route-link"
                                onClick={expandMenu}
                            >
                                <>
                                    <span>{route.name}</span>
                                    {route.dropdown && <div className="route-link-dropdown-content">{route.dropdown.content}</div>}
                                </>
                            </NavLink>
                        </div>
                    ))}
                    {/* {loggedIn && authRoutes && authRoutes.map((route, index) => {
                        if (route.path === '/tournament-submission' && userData.role !== 'clubRep') {
                        } else {
                            return (
                                <div className="flex-column" key={index}>
                                    <NavLink
                                        key={route.path}
                                        exact 
                                        to={route.path}
                                        activeClassName="is-active"
                                        className="route-link"
                                        onClick={expandMenu}
                                    >
                                        <>
                                            <span>{route.name}</span>
                                            {route.dropdown && <div className="route-link-dropdown-content">{route.dropdown.content}</div>}
                                        </>
                                    </NavLink>
                                </div>
                            )
                        }
                    })} */}
                    {unauthRouteLast && unauthRouteLast.map((route, index) => (
                        <div className="flex-column" key={index}>
                            <NavLink
                                key={route.path}
                                exact 
                                to={route.path}
                                activeClassName="is-active"
                                className="route-link"
                                onClick={expandMenu}
                            >
                                <>
                                    <span>{route.name}</span>
                                    {route.dropdown && <div className="route-link-dropdown-content">{route.dropdown.content}</div>}
                                </>
                            </NavLink>
                        </div>
                    ))}
                    {/* <LanguageDropDownMenu mobile={true}/> */}
                    {!loggedIn ? (<div className="login-container-mobile flex">
                        <div onClick={() => {
                            history.push('/login')
                            expandMenu()
                        }} className={`login-type-wrapper ${location.pathname === '/login' ? 'active-link' : ''}`}>Login</div>&nbsp;|&nbsp;<div className={`login-type-wrapper ${location.pathname === '/register' ? 'active-link' : ''}`} onClick={() => {
                            history.push('/register')
                            expandMenu()
                        }}>Register</div>
                    </div>) : 
                    (<div className="profile-container-mobile flex">
                        <div onClick={() => {
                            history.push('/profile')
                            expandMenu()
                        }} className={`profile-option-wrapper ${location.pathname === '/profile' ? 'active-link' : ''}`}>Profile</div>&nbsp;|&nbsp;<div className={`profile-option-wrapper ${location.pathname === '/logout' ? 'active-link' : ''}`} onClick={() => {
                            history.push('/logout')
                            onLogout()
                            expandMenu()
                        }}>Logout</div>
                    </div>)}
                </div>
                <div className='flex align-center'>
                    {!loggedIn ? (<div className="login-container flex">
                        <div onClick={() => {
                            history.push('/login')
                            expandMenu()
                        }} className={`login-type-wrapper ${location.pathname === '/login' ? 'active-link' : ''}`}>Login</div>&nbsp;|&nbsp;<div className={`login-type-wrapper ${location.pathname === '/register' ? 'active-link' : ''}`} onClick={() => {
                            history.push('/register')
                            expandMenu()
                        }}>Register</div>
                    </div>) :
                    (<div className="profile-container flex">
                        <div onClick={() => {
                            history.push('/profile')
                            expandMenu()
                        }} className={`profile-option-wrapper ${location.pathname === '/profile' ? 'active-link' : ''}`}>Profile</div>&nbsp;|&nbsp;<div className={`profile-option-wrapper`} onClick={() => {
                            onLogout()
                            expandMenu()
                            history.push('/login')
                        }}>Logout</div>
                    </div>)}
                    {/* <LanguageDropDownMenu /> */}
                </div>
                <div className="menu icon" onClick={expandMenu}>
                    <FontAwesomeIcon icon={expanded ? faTimes : faBars}/>
                </div>
            </div>
            <ToastContainer autoClose={3000} />
        </>
    )
}

export default NavBar