import PropTypes from "prop-types";
import { Badge as UiBadge, BADGE_VARIANT_KEYS } from "../uiCheck";

const Badge = ({
  children,
  variant = "default",
  size = "md",
  interactive = false,
  className = "",
  as: Component = "span",
  ...rest
}) => (
  <UiBadge
    as={Component}
    variant={variant}
    size={size}
    interactive={interactive}
    className={className}
    {...rest}
  >
    {children}
  </UiBadge>
);

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(BADGE_VARIANT_KEYS),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  interactive: PropTypes.bool,
  className: PropTypes.string,
  as: PropTypes.elementType,
};

export default Badge;
