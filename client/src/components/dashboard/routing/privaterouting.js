import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const privaterouting = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      !auth.isAuthenticated && !auth.loading ? (
        <Redirect to="/signin" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

privaterouting.propTypes = {};

const mstp = (state) => ({
  auth: state.auth,
});

export default connect(mstp)(privaterouting);
