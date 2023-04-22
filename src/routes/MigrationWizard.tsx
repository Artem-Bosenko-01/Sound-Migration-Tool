import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { StepContent } from '@mui/material';
import steps from '../MigrationSteps';
import { useState } from 'react';
import icons from '../Icons';

const MigrationWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSrcPlatform, setSelectedSrcPlatform] = useState<keyof typeof icons | undefined>(
    undefined,
  );
  const [selectedDstPlatform, setSelectedDstPlatform] = useState<keyof typeof icons | undefined>(
    undefined,
  );

  const handleNext = () => {
    if (steps.length - 1 === activeStep) {
      handleReset();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ padding: '30px 25px 0px' }} display={'flex'} justifyContent={'center'}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <>
                {step.stepRenderer({
                  onReset: handleReset,
                  setSelectedSrcPlatform,
                  selectedSrcPlatform,
                  setSelectedDstPlatform,
                  selectedDstPlatform
                })}
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                      Back
                    </Button>
                  </div>
                </Box>
              </>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default MigrationWizard;
