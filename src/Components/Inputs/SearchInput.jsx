import PropTypes from "prop-types";
import { inputClassName } from "./inputStyles";
import { createSanitizedHandlers } from "./inputSanitize";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search records...",
  className = "",
  ...props
}) => {
  const handlers = createSanitizedHandlers({
    type: "search",
    onChange,
  });

  return (
    <div className={`dash-search ${className}`}>
      <input
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        className={inputClassName({ className: "h-10 w-full pl-10" })}
        {...props}
        {...handlers}
      />
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default SearchInput;
