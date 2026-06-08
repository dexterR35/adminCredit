import PropTypes from "prop-types";
import IconR from "../utils/_Icon";
import { cx } from "./utils";

export const PageTitle = ({ children, eyebrow, subtitle, actions }) => (
  <div className="page-title">
    <div className="min-w-0">
      {eyebrow && <p className="page-title__eyebrow">{eyebrow}</p>}
      <h1>{children}</h1>
      {subtitle && <p className="page-title__subtitle">{subtitle}</p>}
    </div>
    {actions && <div className="page-title__actions">{actions}</div>}
  </div>
);

PageTitle.propTypes = {
  children: PropTypes.node.isRequired,
  eyebrow: PropTypes.string,
  subtitle: PropTypes.node,
  actions: PropTypes.node,
};

export const Card = ({ children, className = "", padded = false }) => (
  <section className={cx("card", padded && "card--padded", className)}>{children}</section>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padded: PropTypes.bool,
};

export const CardHeader = ({ title, subtitle, actions }) => (
  <header className="card-header">
    <div className="min-w-0">
      {title && <h2>{title}</h2>}
      {subtitle && <p>{subtitle}</p>}
    </div>
    {actions && <div className="card-header__actions">{actions}</div>}
  </header>
);

CardHeader.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  actions: PropTypes.node,
};

export const CardBody = ({ children, className = "" }) => (
  <div className={cx("card-body", className)}>{children}</div>
);

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const renderSummaryIcon = (icon) => {
  if (!icon) return null;
  if (typeof icon === "string") return <IconR icon={icon} size={17} />;
  if (typeof icon === "function") {
    const Icon = icon;
    return <Icon className="h-5 w-5" aria-hidden />;
  }
  return icon;
};

export const SummaryCard = ({
  label,
  value,
  subLabel,
  detail,
  icon,
  tone = "accent",
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="summary-card" aria-busy="true" aria-label={`Loading ${label}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="skeleton h-3 w-28" />
          <div className="skeleton h-9 w-9 rounded-md" />
        </div>
        <div className="skeleton mt-4 h-7 w-16" />
        <div className="skeleton mt-2 h-3 w-32" />
      </div>
    );
  }

  return (
    <div className="summary-card">
      <div className="summary-card__top">
        <p className="summary-card__label">{label}</p>
        {icon && (
          <span className={cx("summary-card__icon", `summary-card__icon--${tone}`)}>
            {renderSummaryIcon(icon)}
          </span>
        )}
      </div>
      <p className="summary-card__value">{value}</p>
      {(subLabel || detail) && (
        <p className="summary-card__detail">{subLabel || detail}</p>
      )}
    </div>
  );
};

SummaryCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subLabel: PropTypes.node,
  detail: PropTypes.node,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType, PropTypes.node]),
  tone: PropTypes.oneOf(["accent", "success", "info", "warning"]),
  loading: PropTypes.bool,
};
