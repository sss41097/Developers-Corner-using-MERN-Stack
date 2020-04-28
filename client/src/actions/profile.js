import axios from "axios";
import { setAlert } from "./alert";

import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  CLEAR_PROFILE,
  GET_REPOS,
} from "./type";

//get current user profile
export const getcurrentprofile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        status: error.response.status,
        msg: error.response.error,
      },
    });
  }
};

//get all profile
export const getallprofiles = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile");
    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (error) {
    console.log(error.response);

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        status: error.response.status,
        msg: error.response.error,
      },
    });
  }
};

//get profile by ID
export const getprofilebyID = (userID) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userID}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (error) {
    console.log(error.response);

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        status: error.response.status,
        msg: error.response.error,
      },
    });
  }
};

//get github repos
export const getgithubrepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  } catch (error) {
    console.log(error.response);

    // dispatch({
    //   type: PROFILE_ERROR,
    //   payload: {
    //     status: error.response.status,
    //     msg: error.response.error,
    //   },
    // });
  }
};

// Create or update profile
export const createprofile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post("/api/profile", formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));

    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    const check = err.response.data.check;
    const error = err.response.data.error;

    if (check) {
      check.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    if (error) {
      dispatch(setAlert(error, "danger"));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//add experience
export const addexperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.put("/api/profile/experience", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Experience Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    const check = err.response.data.check;
    const error = err.response.data.error;

    if (check) {
      check.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    if (error) {
      dispatch(setAlert(error, "danger"));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//add education
export const addeducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.put("/api/profile/education", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Education Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    const check = err.response.data.check;
    const error = err.response.data.error;

    if (check) {
      check.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    if (error) {
      dispatch(setAlert(error, "danger"));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// selete experience
export const deleteexperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Experience Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// delete education
export const deleteeducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Education Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// delete whole account
export const deleteaccount = () => async (dispatch) => {
  if (
    window.confirm("This will permanently DELETE your account. Are you sure ?")
  ) {
    try {
      await axios.delete("/api/profile");

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(
        setAlert("Your account has been permanantly deleted", "success")
      );
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
