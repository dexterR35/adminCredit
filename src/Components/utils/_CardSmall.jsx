import IconR from "./_Icon"

const CardSmall = ({ _one, _two, _three, icon, className, onDetailsClick }) => {
    const backgroundClass = className || 'bg-gray-100';
    return (
        <div className={`${backgroundClass} rounded-lg p-4 w-56 shadow-md`}>
            <div>
                <div className="flex items-center justify-between gap-2">
                    <p className="text-md text-start text-gray-800 font-semibold">{_one}</p>
                    <IconR icon={icon} size={20} />
                </div>
                <p className="text-blue-800 text-4xl font-bold my-1">{_two}</p>
                {_three === "Details"
                    ? <button onClick={onDetailsClick} className="text-blue-500 text-[12px] text-end float-right">{_three}</button>
                    : <p className="text-gray-600 text-[11px] capitalize text-end">{_three}</p>
                }
            </div>
        </div>
    );
};

export default CardSmall