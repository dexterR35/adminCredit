import PropTypes from "prop-types";
import { Tab, Tabs, TabProgress } from "../../Components/Tabs";

const FisaReportStepper = ({
  steps,
  currentStep,
  maxStepReached,
  onStepClick,
}) => {
  const currentTitle = steps[currentStep]?.title;

  return (
    <TabProgress
      current={currentStep}
      total={steps.length}
      label={`Step ${currentStep + 1} of ${steps.length}${currentTitle ? ` · ${currentTitle}` : ""}`}
    >
      <div className="fisa-stepper-tabs">
        <Tabs ariaLabel="Form steps">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isReachable = index <= maxStepReached;

            return (
              <Tabs.Item key={step.id}>
                <Tab
                  label={step.title}
                  showIndex={false}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  disabled={!isReachable}
                  onClick={() => isReachable && onStepClick(index)}
                />
              </Tabs.Item>
            );
          })}
        </Tabs>
      </div>
    </TabProgress>
  );
};

FisaReportStepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  currentStep: PropTypes.number.isRequired,
  maxStepReached: PropTypes.number.isRequired,
  onStepClick: PropTypes.func.isRequired,
};

export default FisaReportStepper;
