

const CardSmall = ({ _one, _two, _three }) => {
    return (
        <div className="bg-red-500 rounded-lg shadow-md p-4">
            <h2 className="text-lg text-start text-white font-semibold mb-4">{_one}</h2>
            <p className="text-white mb-2 ">{_two}</p>
            <p className="text-white">{_three}</p>
        </div>
    );
};

export default CardSmall