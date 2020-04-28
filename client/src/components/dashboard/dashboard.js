import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getcurrentprofile } from "../../actions/profile";
import Spinner from "../layout/spinner";
import { loadUser } from "../../actions/auth";
import Dashboardactions from "./dashboardactions";
import Listexperience from "./listexperience";
import Listeducation from "./listeducation";
import { deleteaccount } from "../../actions/profile";

const Dashboard = ({
  getcurrentprofile,
  auth,
  deleteaccount,
  profile: { profile, loading },
}) => {
  //this loads profile only once when come on dashboard
  //if used as dispatch, then it would refresh profile many times which is bad

  useEffect(() => {
    getcurrentprofile();
  }, [getcurrentprofile]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i>Welcome {auth.user && auth.user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <Dashboardactions />
          <Listexperience experience={profile.experience} />
          <Listeducation education={profile.education} />
          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteaccount()}>
              <i className="fas fa-user-minus" /> Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {};

const mstp = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mstp, { getcurrentprofile, loadUser, deleteaccount })(
  Dashboard
);
