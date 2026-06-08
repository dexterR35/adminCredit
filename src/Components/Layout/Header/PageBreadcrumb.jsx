import { Link } from "react-router-dom";
import { HiOutlineChevronRight } from "react-icons/hi2";
import PropTypes from "prop-types";

const PageBreadcrumb = ({ crumbs }) => (
  <nav className="app-breadcrumb" aria-label="Breadcrumb">
    <ol className="flex min-w-0 flex-wrap items-center gap-1">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        const isCurrent = crumb.current || isLast;

        return (
          <li key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-1">
            {index > 0 && (
              <HiOutlineChevronRight
                className="h-3.5 w-3.5 shrink-0 text-gray-300"
                aria-hidden
              />
            )}
            {isCurrent || !crumb.path ? (
              <span
                className="truncate text-xs font-medium text-gray-900"
                aria-current={isCurrent ? "page" : undefined}
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="truncate text-xs font-medium text-gray-500 transition-colors hover:text-primary-700"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

PageBreadcrumb.propTypes = {
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
      current: PropTypes.bool,
    })
  ).isRequired,
};

export default PageBreadcrumb;
