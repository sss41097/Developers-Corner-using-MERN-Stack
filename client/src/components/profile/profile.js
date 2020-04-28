import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/spinner";
import Profiletop from "./profiletop";
import Profileabout from "./profileabout";
import Profileexperience from "./profileexperience";
import Profileeducation from "./profileeducation";
import Profilegithub from "./profilegithub";
import { getprofilebyID } from "../../actions/profile";

const Profile = ({
  getprofilebyID,
  profile: { profile, loading },
  auth,
  match,
}) => {
  useEffect(() => {
    getprofilebyID(match.params.id);
  }, [getprofilebyID, match.params.id]);

  return loading ? (
    <Spinner />
  ) : profile === null ? (
    <Fragment>This user does not have profile.</Fragment>
  ) : (
    <Fragment>
      <Link to="/profiles" className="btn btn-light">
        Back To Profiles
      </Link>
      {auth.isAuthenticated &&
        auth.loading === false &&
        auth.user._id === profile.user._id && (
          <Link to="/edit-profile" className="btn btn-dark">
            Edit Profile
          </Link>
        )}
      <div className="profile-grid my-1">
        <Profiletop profile={profile} />
        <Profileabout profile={profile} />
        <div className="profile-exp bg-white p-2">
          <h2 className="text-primary">Experience</h2>
          {profile.experience.length > 0 ? (
            <Fragment>
              {profile.experience.map((experience) => (
                <Profileexperience
                  key={experience._id}
                  experience={experience}
                />
              ))}
            </Fragment>
          ) : (
            <h4>No experience credentials</h4>
          )}
        </div>

        <div className="profile-edu bg-white p-2">
          <h2 className="text-primary">Education</h2>
          {profile.education.length > 0 ? (
            <Fragment>
              {profile.education.map((education) => (
                <Profileeducation key={education._id} education={education} />
              ))}
            </Fragment>
          ) : (
            <h4>No education credentials</h4>
          )}
        </div>

        {profile.githubusername && (
          <Profilegithub username={profile.githubusername} />
        )}
      </div>
    </Fragment>
  );
};

const mstp = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mstp, { getprofilebyID })(Profile);
