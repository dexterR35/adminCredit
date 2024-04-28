import IconR from "./_Icon"
import { DetailsButton } from '../Buttons/Buttons'
const CardSmall = ({ _one, _two, _three, icon, className, onDetailsClick }) => {
    const backgroundClass = className || 'bg-white';
    return (
        <div className={`${backgroundClass} rounded-lg p-3 w-52 shadow-md`}>
            <div>
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-start text-gray-800 font-semibold">{_one}</p>
                    <IconR icon={icon} size={24} />
                </div>
                <p className="text-blue-800 text-3xl font-bold">{_two}</p>
                {_three === "Details"
                    ? <p className="text-end text-blue-600"><DetailsButton>{_three}</DetailsButton></p>
                    : <p className="text-gray-600 text-[12px] capitalize text-end p-1">{_three}</p>
                }
            </div>
        </div>
    );
};

export default CardSmall