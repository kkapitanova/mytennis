import React, { useEffect, useState } from 'react';
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
  Login, 
  Register,
  Home,
  Players,
  Rankings,
  TournamentCalendar,
  TournamentSubmission,
  MyTournaments,
  About,
  // Chats,
  LogoutSuccess,
  Profile
} from './containers'

import {
  NavBar,
  Footer
} from './components'

// firebase
import './firebase-config';


const unauthenticatedNavbarRoutes = [
  {
    path: '/tournament-calendar',
    name: "Tournament Calendar",
    Component: TournamentCalendar,
    exact: false,
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
    // dropdown: {
    //   content: <div className="flex-column slide-in-left">
    //     <div><NavLink className="dropdown-option" to={{ pathname: '/rankings/women', state: { rankings: 'women'} }}>Women's Rankings</NavLink></div>
    //     <div><NavLink className="dropdown-option" to={{ pathname: '/rankings/men', state: { rankings: 'men'} }}>Men's Rankings</NavLink></div>
    //     <div><NavLink className="dropdown-option" to={{ pathname: '/rankings/mixed-doubles', state: { rankings: 'mixed-doubles'} }}>Mixed Doubles Rankings</NavLink></div>
    //   </div>
    // }
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
    path: '/',
    name: "Home",
    exact: true,
    Component: Home 
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
  // { // uncomment when chats feature is ready
  //   path: '/chats',
  //   name: "Chats",
  //   exact: true, 
  //   Component: Chats 
  // }, 
]

const authenticatedRoutes = [
  {
    path: '/profile',
    name: "Profile",
    exact: true, 
    Component: Profile 
  },
]


const App = () => {
  const userData = JSON.parse(sessionStorage.getItem('userData')) || {} // TODO: replace with function that fetches data from firebase
  const [loggedIn, setLoggedIn] = useState(false)
  
  useEffect(() => {
    window.scrollTo(0,0)

    if (userData) {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
  }, [])

  return (
    <div className="App">
      <Router>
          <NavBar unauthRoutes={unauthenticatedNavbarRoutes} unauthRouteLast={unauthenticatedNavbarRouteLast} authRoutes={authenticatedNavbarRoutes}/>
          <Switch>
            <div className="body-wrapper">
              {[...unauthenticatedNavbarRoutes, ...unauthenticatedRoutes].map(({ path, exact, Component }) => (
                <Route key={path} exact={exact} path={path} component={Component}>
                </Route>
              ))}
              {loggedIn && [...authenticatedNavbarRoutes, ...authenticatedRoutes].map(({ path, exact, Component }) => (
                <Route key={path} exact={exact} path={path} component={Component}>
                </Route>
              ))}
              {[...unauthenticatedNavbarRouteLast].map(({ path, exact, Component }) => (
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
