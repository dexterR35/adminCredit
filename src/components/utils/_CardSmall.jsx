import IconR from "./_Icon"

const CardSmall = ({ _one, _two, _three, icon, className, onDetailsClick }) => {
    const backgroundClass = className || 'bg-gray-100';
    const detailsPath = "/details/path";
    return (
        <div className={`${backgroundClass} rounded-lg p-4 w-52 shadow-md`}>
            <div>
                <div className="flex items-center justify-between gap-2">
                    <p className="text-md text-start text-gray-800 font-semibold">{_one}</p>
                    <IconR icon={icon} size={20} />
                </div>
                <p className="text-gray-800 text-4xl font-bold">{_two}</p>
                {_three === "Details"
                    ? <button onClick={onDetailsClick} className="text-blue-500 text-sm text-end float-right">{_three}</button>
                    : <p className="text-gray-600 text-sm text-end">{_three}</p>
                }
            </div>

        </div>
    );
};

export default CardSmall