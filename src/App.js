import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.scss';
import firebase from 'firebase/compat/app';
import { getDatabase, ref, set, child, get } from "firebase/database";
import i18n from './i18n';

//router
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  NavLink,
  useHistory,
  useLocation,
} from "react-router-dom";

//component imports
import { 
  NavBar, 
  Home,
  Players,
  Rankings,
  TournamentCalendar,
  Footer,
} from './containers'

//translation
import { useTranslation } from 'react-i18next';
import TournamentSubmission from './containers/tournament-submission/TournamentSubmission';

const firebaseConfig = {
  apiKey: "AIzaSyCZ70cdaIdr7-Od3fnhztu9aFLC4EOtSfQ", //process.env.FIREBASE_PUBLIC_PROJECT_WEB_API,
  databaseURL:  'https://my-tennis-platform-default-rtdb.europe-west1.firebasedatabase.app/' , //`${process.env.FIREBASE_PUBLIC_PROJECT_ID}.firebaseapp.com`,
  authDomain: 'https://my-tennis-platform-default-rtdb.firebaseio.com', //`https://${process.env.FIREBASE_PUBLIC_PROJECT_ID}-default-rtdb.firebaseio.com`,
  projectID: 'my-tennis-platform'
}


const app = firebase.initializeApp(firebaseConfig)
const dbRef = ref(getDatabase(app));

// const firebaseui = require('firebaseui');
// const ui = new firebaseui.auth.AuthUI(firebase.auth());

// ui.start('#firebaseui-auth-container', {
//   signInOptions: [
//     firebase.auth.EmailAuthProvider.PROVIDER_ID
//   ],
//   // Other config options...
// });


const App = () => {
  const [ value, setValue ] = useState()
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }

  const unauthenticatedNavbarRoutes = [
    {
      path: '/',
      name: t("Navbar.Home"),
      exact: true,
      Component: Home 
    },
    {
      path: '/tournament-calendar',
      name: t("Navbar.TournamentCalendar"),
      Component: TournamentCalendar,
      exact: false,
      dropdown: {
        content: <div className="flex-column slide-in-left">
          <div><NavLink to={{ pathname: '/tournament-calendar/women', state: { tournamentCalendar: 'women'} }}>Women's Calendar</NavLink></div>
          <div><NavLink to={{ pathname: '/tournament-calendar/men', state: { tournamentCalendar: 'men'} }}>Men's Calendar</NavLink></div>
        </div>
      } 
    },
    {
      path: '/players',
      name: t("Navbar.Players"),
      exact: true, 
      Component: Players 
    },
    {
      path: '/rankings', 
      name: t("Navbar.Rankings"),
      Component: Rankings,
      exact: false,
      dropdown: {
        content: <div className="flex-column slide-in-left">
          <div><NavLink to={{ pathname: '/rankings/women', state: { rankings: 'women'} }}>Women's Rankings</NavLink></div>
          <div><NavLink to={{ pathname: '/rankings/men', state: { rankings: 'men'} }}>Men's Rankings</NavLink></div>
          <div><NavLink to={{ pathname: '/rankings/mixed-doubles', state: { rankings: 'mixed-doubles'} }}>Mixed Doubles Rankings</NavLink></div>
        </div>
      }
    },
    // { path: '/about', name: t("Navbar.About"), Component: About }, //this is optional
  ]

  const authenticatedRoutes = [
    {
      path: '/tournament-submission',
      name: "Tournament Submission",
      exact: true, 
      Component: TournamentSubmission 
    },
  ]

  const getData = () => {
      // example data getting method
    get(child(dbRef, 'TEST')).then((snapshot) => {
      if (snapshot.exists()) {
        setValue(snapshot.val())
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error("error", error);
    });

  }

  useEffect(() => {
    window.scrollTo(0,0)
    getData()
  }, [])

  return (
    <div className="App">
      <Router>
          <NavBar routes={unauthenticatedNavbarRoutes}/>
          {/* <div>TEST DATA FROM FIREBASE: {JSON.stringify(value)}</div>
          <div>Test translation: {t("Test")}</div> */}
          <Switch>
            <div className="body-wrapper">
              {[...unauthenticatedNavbarRoutes, ...authenticatedRoutes].map(({ path, exact, Component }) => (
                <Route key={path} exact={exact} path={path} component={Component}>
                </Route>
              ))}
              <Route path="/*" component={Footer} />
              {/* <Redirect to="/" /> */}
            </div>
          </Switch>
        </Router>
    </div>
  );
}

export default App;
