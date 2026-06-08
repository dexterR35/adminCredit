import PropTypes from "prop-types";

const Tabs = ({ children, ariaLabel = "Tabs", className = "" }) => (
  <nav aria-label={ariaLabel} className={`tabs-nav ${className}`.trim()}>
    <ol className="tabs-list" role="tablist">
      {children}
    </ol>
  </nav>
);

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
};

const TabItem = ({ children }) => (
  <li role="presentation">{children}</li>
);

TabItem.propTypes = {
  children: PropTypes.node.isRequired,
};

Tabs.Item = TabItem;

export default Tabs;
