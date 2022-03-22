import React, { useState, useEffect } from 'react'

//router
import {
    NavLink,
    Link,
    useHistory,
    useLocation,
  } from "react-router-dom";

//material component imports
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

//translation
import { useTranslation } from 'react-i18next';

//styles
import './NavBar.scss'
// import './topnav.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

import logo from '../../assets/images/logo.png'

// import Dropdown from 'react-dropdown';
// import 'react-dropdown/style.css';

//TODO: responsive nav bar
//fontawesome icons
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faBars } from '@fortawesome/free-solid-svg-icons'

// const options = [
//     'BG', 'EN'
// ];

const LanguageDropDownMenu = ({ mobile }) => {

    const [ t, i18n ] = useTranslation();

    const defaultOption = localStorage.getItem('i18nextLng') ? localStorage.getItem('i18nextLng').toUpperCase() : 'BG';

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (lang) => {
        setAnchorEl(null);
        i18n.changeLanguage(lang)
    };

    return (
        <div className={mobile ? "language-dropdown-responsive" : "language-dropdown"}>
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                        {defaultOption === "BG" ? "БГ" : "EN"}
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={() => handleClose(localStorage.getItem('i18nextLng') ? localStorage.getItem('i18nextLng') : "bg")}
                    >
                        <MenuItem name="en" onClick={() => handleClose("en")}>English</MenuItem>
                        <MenuItem name="bg" onClick={() => handleClose("bg")}>Български</MenuItem>
                    </Menu>
                </div>
    )
}
    
const NavBar = ({ unauthRoutes, authRoutes }) => {

    const [ t, i18n ] = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const history = useHistory();
    const location = useLocation();
        
    // const onDropDownChange = props => {
    //     const lang = props.value.toLowerCase()
    //     i18n.changeLanguage(lang)
    // }

    const expandMenu = () => {

        const navbar = document.getElementById("navbar");

        if (navbar.className === "navbar") {
            navbar.classList.add("responsive")
            
        } else {
            navbar.classList.remove("responsive")
        }

        setExpanded(!expanded)
    }

    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')

        if (authToken) {
            // navigate('/home')
        }

        if (!authToken) {
            // navigate('/login')
        }
    }, [])

    return (
        <>
            <div className="navbar" id="navbar">
                <div className='logo-wrapper flex align-center'>
                    <img src={logo} height={40}></img>
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
                    {/* <LanguageDropDownMenu mobile={true}/> */}
                    <div className="login-container-mobile flex">
                        <div onClick={() => history.push('/login')} className={`login-type-wrapper ${location.pathname === '/login' ? 'active-link' : ''}`}>Login</div>&nbsp;|&nbsp;<div className={`login-type-wrapper ${location.pathname === '/register' ? 'active-link' : ''}`} onClick={() => history.push('/register')}>Register</div>
                    </div>
                </div>
                <div className='flex align-center'>
                    <div className="login-container flex">
                        <div onClick={() => history.push('/login')} className={`login-type-wrapper ${location.pathname === '/login' ? 'active-link' : ''}`}>Login</div>&nbsp;|&nbsp;<div className={`login-type-wrapper ${location.pathname === '/register' ? 'active-link' : ''}`} onClick={() => history.push('/register')}>Register</div>
                    </div>
                    {/* <LanguageDropDownMenu /> */}
                </div>
                <div className="menu icon" onClick={expandMenu}>
                    <FontAwesomeIcon icon={expanded ? faTimes : faBars}/>
                </div>
            </div>
        </>
    )
}

export default NavBar