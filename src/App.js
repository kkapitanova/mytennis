import React, { useState, useEffect } from 'react';
import './App.scss';

// router
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  NavLink,
  useHistory,
  useLocation,
} from "react-router-dom";

// component imports
import { 
  NavBar, 
  Login, 
  Register,
  Home,
  Players,
  Rankings,
  TournamentCalendar,
  Footer,
  MyTournaments,
  About,
  Chats
} from './containers'

// translation
import { useTranslation } from 'react-i18next';
import TournamentSubmission from './containers/tournament-submission/TournamentSubmission';

// firebase
import './firebase-config';


// const dbRef = ref(getDatabase(app));

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
      name: "Home",
      exact: true,
      Component: Home 
    },
    {
      path: '/tournament-calendar',
      name: "Tournament Calendar",
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
      name: "Players",
      exact: true, 
      Component: Players 
    },
    {
      path: '/rankings', 
      name: "Rankings",
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
    { 
      path: '/about', 
      name: "About", 
      Component: About 
    },
    { 
      path: '/login', 
      name: "Login", 
      Component: Login 
    },
    { 
      path: '/register', 
      name: "Register", 
      Component: Register 
    },
  ]

  const unauthenticatedRoutes = [
    // { 
    //   path: '/login', 
    //   name: "Login", 
    //   Component: Login 
    // },
    // { 
    //   path: '/register', 
    //   name: "Register", 
    //   Component: Register 
    // },
  ]

  const authenticatedRoutes = [
    {
      path: '/tournament-submission',
      name: "Tournament Submission",
      exact: true, 
      Component: TournamentSubmission 
    },
    {
      path: '/my-tournaments',
      name: "My Tournaments",
      exact: true, 
      Component: MyTournaments 
    },
    {
      path: '/chats',
      name: "Chats",
      exact: true, 
      Component: Chats 
    },
  ]

  const getData = () => {
      // example data getting method
    // get(child(dbRef, 'TEST')).then((snapshot) => {
    //   if (snapshot.exists()) {
    //     setValue(snapshot.val())
    //   } else {
    //     console.log("No data available");
    //   }
    // }).catch((error) => {
    //   console.error("error", error);
    // });

  }

  useEffect(() => {
    window.scrollTo(0,0)
    getData()
  }, [])

  return (
    <div className="App">
      <Router>
          <NavBar unauthRoutes={unauthenticatedNavbarRoutes} authRoutes={authenticatedRoutes}/>
          {/* <div>TEST DATA FROM FIREBASE: {JSON.stringify(value)}</div>
          <div>Test translation: {t("Test")}</div> */}
          <Switch>
            <div className="body-wrapper">
              {[...unauthenticatedNavbarRoutes, ...authenticatedRoutes, ...unauthenticatedRoutes].map(({ path, exact, Component }) => (
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
