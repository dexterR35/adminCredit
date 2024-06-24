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
  className = "bg-gray-100",
}) => {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <div className={`${className} rounded-md py-2 px-3 shadow-md`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-start font-semibold">{_one}</p>
        <IconR icon={icon} />
      </div>
      <p className="text-[1.7rem] font-bold">{_two}</p>
      {_three === "Details" ? (
        <p className="text-end">
          <CustomButton
            text='button.details' 
            additionalClasses="text-[12px] font-normal !p-1 m-0 bg-transparent underline capitalize text-gray-900 flex w-full justify-end"
            onClick={openModal}
            buttonType="default"
            
          />
          <Modal isOpen={isOpen} onClose={closeModal} title="modalTitle.detailsClients">
            {/* <p>{title}</p> */}
          </Modal>
        </p>
      ) : (
        <p className="text-[12px] capitalize text-end p-1">{_three}</p>
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
