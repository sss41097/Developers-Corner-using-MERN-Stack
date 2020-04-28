import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const alert = ({ alerts }) => {
  return (
    <div>
      {alerts != null &&
        alerts.length > 0 &&
        alerts.map((alert) => (
          <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
          </div>
        ))}
    </div>
  );
};

alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mstp = (state) => ({
  alerts: state.alert,
});

export default connect(mstp)(alert);
