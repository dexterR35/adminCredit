import Button from "./Button";

/** @deprecated Prefer `<Button variant="..." />` — kept for existing imports */
const CustomButton = ({
  onClick,
  text = "default",
  buttonType = "default",
  type = "button",
  additionalClasses = "",
  disabled = false,
}) => (
  <Button
    text={text}
    buttonType={buttonType}
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={additionalClasses}
  />
);

export { Button, CustomButton };
export default Button;
