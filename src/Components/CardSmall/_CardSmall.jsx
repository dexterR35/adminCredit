import React from "react";
import PropTypes from "prop-types";
import IconR from "../utils/_Icon";
import { CustomButton } from "../Buttons/Buttons";
import { useModal, Modal } from "../Modal/useModal";

const CardSmall = ({
  _one = "",
  _two = "",
  _three = "",
  icon,
  className = "bg-gradient-to-br from-gray-50 to-gray-100",
}) => {
  const { isOpen, openModal, closeModal } = useModal();
  
  return (
    <div className={`${className} rounded-xl p-5 shadow-sm border border-gray-600 backdrop-blur-sm bg-gray-800`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-sm font-semibold text-gray-300 uppercase tracking-wide">{_one}</p>
        <div className="p-2 rounded-lg bg-gray-700">
          <IconR icon={icon} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-2">{_two}</p>
      {_three === "Details" ? (
        <div className="mt-3 pt-3 border-t border-gray-600">
          <CustomButton
            text='button.details' 
            additionalClasses="text-xs font-medium !p-2 m-0 bg-gray-700 text-gray-200 flex w-full justify-center rounded-lg shadow-sm"
            onClick={openModal}
            buttonType="default"
          />
          <Modal isOpen={isOpen} onClose={closeModal} title="modalTitle.detailsClients">
            {/* <p>{title}</p> */}
          </Modal>
        </div>
      ) : (
        <p className="text-xs font-medium text-gray-400 mt-2 capitalize">{_three}</p>
      )}
    </div>
  );
};

export default CardSmall;

CardSmall.propTypes = {
  _one: PropTypes.string,
  _two: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  _three: PropTypes.string,
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
};
