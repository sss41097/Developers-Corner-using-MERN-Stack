import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import Spinner from "../layout/spinner";
import Postitem from "./postitem";
import Postform from "./postform";
import { getposts } from "../../actions/post";

const Posts = ({ getposts, post: { posts, loading } }) => {
  useEffect(() => {
    getposts();
  }, [getposts]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome to the community
      </p>
      <Postform />
      <div className="posts">
        {posts.map((post) => (
          <Postitem key={post._id} post={post} />
        ))}
      </div>
    </Fragment>
  );
};

const mstp = (state) => ({
  post: state.post,
});

export default connect(mstp, { getposts })(Posts);
