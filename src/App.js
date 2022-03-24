import React, { useEffect } from 'react';
import './App.scss';

// router
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Redirect,
  NavLink,
} from "react-router-dom";

// container imports
import { 
  NavBar, 
  Login, 
  Register,
  Home,
  Players,
  Rankings,
  TournamentCalendar,
  TournamentSubmission,
  Footer,
  MyTournaments,
  About,
  Chats,
  LogoutSuccess,
  Profile
} from './containers'

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
]

const unauthenticatedNavbarRouteLast = [
  { 
    path: '/about', 
    name: "About", 
    Component: About 
  }
]

const unauthenticatedRoutes = [
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
  { 
    path: '/logout-success', 
    name: "Logout Success", 
    Component: LogoutSuccess 
  },
]

const authenticatedNavbarRoutes = [
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
  // {
  //   path: '/chats',
  //   name: "Chats",
  //   exact: true, 
  //   Component: Chats 
  // },
]

const authenticatedRoutes = [
  // {
  //   path: '/tournament-submission',
  //   name: "Tournament Submission",
  //   exact: true, 
  //   Component: TournamentSubmission 
  // },
  // {
  //   path: '/my-tournaments',
  //   name: "My Tournaments",
  //   exact: true, 
  //   Component: MyTournaments 
  // },
  {
    path: '/profile',
    name: "Profile",
    exact: true, 
    Component: Profile 
  },
  {
    path: '/chats',
    name: "Chats",
    exact: true, 
    Component: Chats 
  },
]


const App = () => {
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
          <NavBar unauthRoutes={unauthenticatedNavbarRoutes} unauthRouteLast={unauthenticatedNavbarRouteLast} authRoutes={authenticatedNavbarRoutes}/>
          {/* <div>TEST DATA FROM FIREBASE: {JSON.stringify(value)}</div>
          <div>Test translation: {t("Test")}</div> */}
          <Switch>
            <div className="body-wrapper">
              {[...unauthenticatedNavbarRoutes, ...authenticatedNavbarRoutes, ...authenticatedRoutes, ...unauthenticatedRoutes, ...unauthenticatedNavbarRouteLast].map(({ path, exact, Component }) => (
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
