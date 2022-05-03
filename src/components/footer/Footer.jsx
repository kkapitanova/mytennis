// fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faMapPin, faPhoneAlt } from '@fortawesome/free-solid-svg-icons'

// material icons
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';

// react router
import { Link } from 'react-router-dom'

// styles
import './Footer.scss'


const Footer = () => {
    const userData = JSON.parse(sessionStorage.getItem('userData')) || {} 

    return (
        <>
            <footer className="footer-wrapper">
                <div className="sections-wrapper">
                    <div className="section-wrapper">
                            <h3>Contacts
                                {/* {t("Footer.Contacts")} */}
                            </h3>
                            <div className="section-wrapper-item">
                                <FontAwesomeIcon style={{height: "20px", width: "20px"}} icon={faPhoneAlt}/>&nbsp;+359&nbsp;MY&nbsp;TENNIS
                            </div>
                            <div className="section-wrapper-item">
                                    <FontAwesomeIcon style={{height: "20px", width: "20px"}} icon={faEnvelope} />&nbsp;inquiries@mytennisplatform.com
                            </div>
                            <div className="section-wrapper-item">
                                <FontAwesomeIcon style={{height: "20px", width: "20px"}} icon={faMapPin} />&nbsp;National Tennis Centre, Sofia, Bulgaria
                            </div>
                        </div>
                        <div className="section-wrapper">
                            <h3>Social Media
                                {/* {t("Footer.SocialMedia")} */}
                            </h3>
                            <div className="section-wrapper-item">
                                <a rel="noreferrer" target="_blank" href="https://www.facebook.com/mytennisplatform"><FacebookIcon />&nbsp;My Tennis Platform</a>
                            </div>
                            <div className="section-wrapper-item">
                                <a rel="noreferrer" target="_blank" href="https://www.instagram.com/mytennisplatform"><InstagramIcon />&nbsp;mytennisplatform</a>          
                            </div>
                        </div>
                        <div className="section-wrapper">
                            <h3>Site Map
                                {/* {t("Footer.SiteMap")} */}
                            </h3>
                            {/* <Link to="/contacts">{t("Footer.GetInTouch")}</Link> */}
                            <Link to="/tournament-calendar">Tournament Calendar</Link>
                            <Link to="/players">Players</Link>
                            <Link to="/rankings">Rankings</Link>
                            {/* <Link to="/about">About Us</Link> */}
                        </div>
                        {userData && userData.role && <div className="section-wrapper">
                            <h3>For You</h3>
                            {/* <Link to="/contacts">{t("Footer.GetInTouch")}</Link> */}
                            {userData.role === 'clubRep' && <Link to="/tournament-submission">Tournament Submission</Link>}
                            <Link to="/my-tournaments">My Tournaments</Link>
                            {/* {userData.role === 'player' && <Link to="/chats">Chats</Link>} uncomment when chats feature is ready */}
                        </div>}
                    </div>
                <div className="copyright-wrapper">Copyright © 2022 My Tennis Platform. All Rights Reserved.
                 {/* {t("Rights.1")} */}
                 </div>
            </footer>
        </>
    )
}

export default Footer