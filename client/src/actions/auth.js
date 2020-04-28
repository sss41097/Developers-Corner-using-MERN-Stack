import axios from "axios";
import { setAlert } from "./alert";

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_PROFILE,
} from "./type";
import setAuthtoken from "././../utils/setAuthToken";

//load user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthtoken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");
    console.log(res.data);
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//register user
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    //response code descides whether it will go to catch.(leaving 200, all catch)
    //err data can be excessed with err.response.data.{name of object}
    const res = await axios.post("/api/user", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());

    dispatch(setAlert("Registration successful", "danger"));
  } catch (err) {
    console.log(err.response);
    const check = err.response.data.check;
    const error = err.response.data.error;
    if (check) {
      check.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    } else {
      dispatch(setAlert(error, "danger"));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

//Login user
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    //response code descides whether it will go to catch.(leaving 200, all catch)
    //err data can be excessed with err.response.data.{name of object}
    const res = await axios.post("/api/auth", body, config);
    console.log(res.data);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());

    dispatch(setAlert("Login successful", "danger"));
  } catch (err) {
    //console.log(err.response.data);
    const check = err.response.data.check;
    const error = err.response.data.error;
    if (check) {
      check.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    } else {
      dispatch(setAlert(error, "danger"));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//logout
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
  dispatch({ type: CLEAR_PROFILE });
};
