import React, { Fragment, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/navbar";
import Landing from "./components/layout/landing";
import Signin from "./components/auth/signin";
import Dashboard from "./components/dashboard/dashboard";
import Register from "./components/auth/register";
import { Provider } from "react-redux";
import store from "./store";
import Alert from "./components/layout/alert";
import { loadUser } from "./actions/auth";
import setAuthtoken from "./utils/setAuthToken";
import PrivateRoute from "./components/dashboard/routing/privaterouting";
import Createprofile from "./components/profileforms/createprofile";
import Editprofile from "./components/profileforms/editprofile";
import Addexperience from "./components/profileforms/addexperience";
import Addeducation from "./components/profileforms/addeducation";
import Profiles from "./components/profiles/profiles";
import Profile from "./components/profile/profile";
import Posts from "./components/posts/posts";
import Post from "./components/post/post";
import notfound from "./components/notfound/notfound";

if (localStorage.token) {
  setAuthtoken(localStorage.token);
}

// useEffect analysis
// if useEffect will run after the initial render
// if variables are passed in [] in 2nd argument, then any change in any of the arguments will cause the useEffect to fire again.
// if [], is not passed, then it will keep on looping and eventually hang(dont know if actually will hang)
// so, here loadUser() fires only once even if you go to different routes, but obviously on refresh on any page, App component rerenders and useEffect is fired again.

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []); //add [] at end, will make it run only once in start, but currenttly it loops

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <section className="container">
              <Alert />
              <Switch>
                <Route exact path="/register" component={Register} />
                <Route exact path="/signin" component={Signin} />
                <Route exact path="/profiles" component={Profiles} />
                <Route exact path="/profile/:id" component={Profile} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={Createprofile}
                />
                <PrivateRoute
                  exact
                  path="/edit-profile"
                  component={Editprofile}
                />
                <PrivateRoute
                  exact
                  path="/add-experience"
                  component={Addexperience}
                />
                <PrivateRoute
                  exact
                  path="/add-education"
                  component={Addeducation}
                />
                <PrivateRoute exact path="/posts" component={Posts} />
                <PrivateRoute exact path="/posts/:id" component={Post} />
                <Route component={notfound} />
              </Switch>
            </section>
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
