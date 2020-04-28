import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/spinner";
import Postitem from "../posts/postitem";
import Commentpost from "../post/commentpost";
import Commentitem from "../post/commentitem";
import { getpost } from "../../actions/post";

const Post = ({ getpost, post: { post, loading }, match }) => {
  useEffect(() => {
    getpost(match.params.id);
  }, [getpost]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/posts" className="btn">
        Back To Posts
      </Link>
      <Postitem post={post} showActions={false} />
      <Commentpost postId={post._id} />
      <div className="comments">
        {post.comments.map((comment) => (
          <Commentitem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getpost })(Post);
