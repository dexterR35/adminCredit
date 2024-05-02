import IconR from "../utils/_Icon"
import { DetailsButton } from '../Buttons/Buttons'

const CardSmall = ({ _one, _two, _three, icon, className, onDetailsClick }) => {
    const backgroundClass = className || 'bg-gray-100';
    return (
        <div className={`${backgroundClass} rounded-md py-2 px-3 shadow-md`}>
            <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-start text-gray-800 font-semibold">{_one}</p>
                <IconR icon={icon} size={20} />
            </div>
            <p className="text-gray-800 text-[1.7rem] font-bold">{_two}</p>
            {_three === "Details"
                ? <p className="text-end"><DetailsButton>{_three}</DetailsButton></p>
                : <p className="text-gray-800 text-[12px] capitalize text-end p-1">{_three}</p>
            }
        </div>
    );
};

export default CardSmall