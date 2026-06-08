import PropTypes from "prop-types";

const FisaConsultantBanner = ({ userName, date }) => (
  <div className="mt-4 flex flex-col gap-3 rounded-xl border border-primary-100 bg-primary-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3">
      <div className="app-user-avatar">{userName?.charAt(0)?.toUpperCase() || "?"}</div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-primary-600">
          Consultant
        </p>
        <p className="text-sm font-semibold capitalize text-gray-900">{userName}</p>
      </div>
    </div>
    <div className="rounded-lg border border-primary-100 bg-white px-3 py-2 sm:text-right">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Date</p>
      <p className="text-sm font-medium text-gray-900">{date}</p>
    </div>
  </div>
);

FisaConsultantBanner.propTypes = {
  userName: PropTypes.string,
  date: PropTypes.string,
};

export default FisaConsultantBanner;
