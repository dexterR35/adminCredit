import PropTypes from "prop-types";

const Tabs = ({ children, ariaLabel = "Tabs", className = "" }) => (
  <nav aria-label={ariaLabel} className={`-mx-1 overflow-x-auto px-1 pb-1 ${className}`.trim()}>
    <ol className="flex min-w-max gap-2" role="tablist">
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
