import React, { useState } from 'react'

//router
import {
    NavLink,
    Link,
  } from "react-router-dom";

//material component imports
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

//translation
import { useTranslation } from 'react-i18next';

//styles
// import './NavBar.scss'
import './topnav.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

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
    
const NavBar = ({ routes }) => {

    const [ t, i18n ] = useTranslation();

    const [expanded, setExpanded] = useState(false);
        
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

    return (
        <>
            <div className="navbar" id="navbar">
                <div className="logo-wrapper">
                    <Link to={"/"}>MYTennis</Link>
                </div>
                <div className="flex links-wrapper">
                    {routes && routes.map(route => (
                        <div className="flex-column">
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
                    <LanguageDropDownMenu mobile={true}/>
                </div>
                <LanguageDropDownMenu />
                <a href="javascript:void(0);" className="icon" onClick={expandMenu}>
                    <FontAwesomeIcon icon={expanded ? faTimes : faBars}/>
                </a>
            </div>
        </>
    )
}

export default NavBar