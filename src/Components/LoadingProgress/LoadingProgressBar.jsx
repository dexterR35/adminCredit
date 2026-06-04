import PropTypes from "prop-types";

const LoadingProgressBar = ({ active = false }) => (
  <div
    className={`dash-loading-progress${active ? " dash-loading-progress--active" : ""}`}
    role="progressbar"
    aria-hidden={!active}
    aria-busy={active}
    aria-label="Loading"
  >
    <div className="dash-loading-progress__bar" />
  </div>
);

LoadingProgressBar.propTypes = {
  active: PropTypes.bool,
};

export default LoadingProgressBar;
