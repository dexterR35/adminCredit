import React from "react";
import PropTypes from "prop-types";
import { badgeClassName, BADGE_VARIANTS_LIST } from "./badgeStyles";

const Badge = ({
  children,
  variant = "default",
  size = "md",
  interactive = false,
  className = "",
  as: Component = "span",
  ...rest
}) => (
  <Component
    className={badgeClassName({ variant, size, interactive, className })}
    {...rest}
  >
    {children}
  </Component>
);

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(BADGE_VARIANTS_LIST),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  interactive: PropTypes.bool,
  className: PropTypes.string,
  as: PropTypes.elementType,
};

export default Badge;
