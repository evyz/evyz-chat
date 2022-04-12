import Login from "../components/Auth/Login/Login";
import Register from "../components/Auth/Register/Register";
import Main from "../components/Main/Main";
import NotFoundPublic from "../components/NotFound/Public/NotFoundPublic";
import Privacy from "../components/Privacy/Privacy";
import Title from "../components/Title/Title";
import { AUTH_ROUTE, LOGOUT_ROUTE, MAIN_ROUTE, NOTFOUND_ROUTE, PRIVACY_ROUTE, REGISTRATION_ROUTE, SETTING_ROUTE, TITLE_ROUTE } from "../consts/paths";

import { Navigate } from 'react-router-dom';
import Logout from "../components/LogOut/Logout";
import Setting from "../components/Setting/Setting";


export const PUBLIC_ROUTE = [
  {
    path: AUTH_ROUTE,
    component: <Login />
  },
  {
    path: REGISTRATION_ROUTE,
    component: <Login />
  },
  {
    path: TITLE_ROUTE,
    component: <Title />
  },
  {
    path: NOTFOUND_ROUTE,
    component: <Navigate to={TITLE_ROUTE} replace />
  },
  {
    path: PRIVACY_ROUTE,
    component: <Privacy />
  }
]

export const AUTHORIZATION_ROUTE = [
  {
    path: MAIN_ROUTE,
    component: <Main />
  },
  {
    path: NOTFOUND_ROUTE,
    component: <Navigate to={MAIN_ROUTE} replace />
  },
  {
    path: SETTING_ROUTE,
    component: <Setting />
  },
  {
    path: LOGOUT_ROUTE,
    component: <Logout />
  },
]