// translation
import { useTranslation } from 'react-i18next';

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

    const [ t, i18n ] = useTranslation();

    return (
        <>
            <footer className="footer-wrapper">
                <div className="sections-wrapper">
                    <div className="section-wrapper">
                            <h3>Contacts
                                {/* {t("Footer.Contacts")} */}
                            </h3>
                            <div className="section-wrapper-item">
                                <a href="tel:+35988423108">
                                    <FontAwesomeIcon style={{height: "20px", width: "20px"}} icon={faPhoneAlt}/>&nbsp;+359&nbsp;885&nbsp;443&nbsp;822
                                </a>
                            </div>
                            <div className="section-wrapper-item">
                                {/* <img alt="phone-icon" src={emailIcon}></img> */}
                                <Link to="/contacts">
                                    <FontAwesomeIcon style={{height: "20px", width: "20px"}} icon={faEnvelope} />&nbsp;inquiries@mytennisplatform.com
                                </Link>
                            </div>
                            <div className="section-wrapper-item">
                                {/* <img alt="phone-icon" src={emailIcon}></img> */}
                                <FontAwesomeIcon style={{height: "20px", width: "20px"}} icon={faMapPin} />&nbsp;National Tennis Centre, Sofia, Bulgaria
                            </div>
                        </div>
                        <div className="section-wrapper">
                            <h3>Social Media
                                {/* {t("Footer.SocialMedia")} */}
                            </h3>
                            <div className="section-wrapper-item">
                                <a rel="noreferrer" target="_blank" href="https://www.facebook.com/mypt.bg"><FacebookIcon />&nbsp;My Tennis Platform</a>
                            </div>
                            <div className="section-wrapper-item">
                                <a rel="noreferrer" target="_blank" href="https://www.instagram.com/mypt.bg"><InstagramIcon />&nbsp;mytennisplatform</a>          
                            </div>
                        </div>
                        {/* <div className="section-wrapper">
                            <div className="classes-wrapper">
                                <div className="classes-wrapper-schedule">
                                    <h4>{t("HIIT")}</h4>
                                    <p>{t("WeekDays.Mon")} 8:30 & 19:00</p>
                                    <p>{t("WeekDays.Wed")} 19:00</p>
                                    <p>{t("WeekDays.Thu")} 8:30</p>
                                    <p>{t("WeekDays.Fri")} 19:00</p>
                                </div>
                                <div className="classes-wrapper-schedule">
                                    <h4>{t("CircuitTraining")}</h4>
                                    <p>{t("WeekDays.Mon")} 18:00</p>
                                    <p>{t("WeekDays.Sat")} 10:00</p>
                                    <p>{t("WeekDays.Sun")} 11:00</p>
                                </div>
                                
                            </div> */}
                        {/* </div> */}
                        <div className="section-wrapper">
                            <h3>Site Map
                                {/* {t("Footer.SiteMap")} */}
                            </h3>
                            <Link to="/about">About Us</Link>
                            {/* <Link to="/contacts">{t("Footer.GetInTouch")}</Link> */}
                            <Link to="/tournament-calendar">Tournament Calendar</Link>
                            <Link to="/players">All Players</Link>
                            <Link to="/tournament-submission">Tournament Submission*</Link>
                            <Link to="/my-tournaments">My Tournaments*</Link>
                        </div>
                    </div>
                <div className="copyright-wrapper">Copyright © 2021 My Tennis Platform. All Rights Reserved.
                 {/* {t("Rights.1")} */}
                 </div>
            </footer>
        </>
    )
}

export default Footer