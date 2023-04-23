import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { Paper, StepContent } from '@mui/material';
import steps from '../MigrationSteps';
import { useState } from 'react';
import icons from '../Icons';
import { PlaylistModel } from '../api-service';
import Typography from '@mui/material/Typography';

const MigrationWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSrcPlatform, setSelectedSrcPlatform] = useState<keyof typeof icons | undefined>(
    undefined,
  );
  const [selectedDstPlatform, setSelectedDstPlatform] = useState<keyof typeof icons | undefined>(
    undefined,
  );
  const [selectedPlaylists, setSelectedPlaylists] = useState<Array<PlaylistModel>>([]);

  const [isNextButtonAvailable, setNextButtonAvailable] = useState(false);
  const [isMigrationCompleted, setMigrationCompleted] = useState(false);

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
    setMigrationCompleted(false)
    setSelectedPlaylists([])
    setSelectedSrcPlatform(undefined)
    setSelectedDstPlatform(undefined)
  };

  return (
    <Box sx={{ padding: '30px 25px 0px' }} display={'flex'} justifyContent={'center'}>
      {isMigrationCompleted ? (
        <Paper square elevation={0} sx={{ p: 3, backgroundColor: "#f2f2f2" }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Start new migration
          </Button>
        </Paper>
      ) : (
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent sx={{ width: '300px' }}>
                <>
                  {step.stepRenderer({
                    setSelectedSrcPlatform,
                    selectedSrcPlatform,
                    setSelectedDstPlatform,
                    selectedDstPlatform,
                    setNextButtonAvailable,
                    selectedPlaylists,
                    setSelectedPlaylists,
                    onSuccessMigration: () => setMigrationCompleted(true),
                  })}
                  <Box sx={{ mb: 2 }}>
                    <div>
                      <Button
                        disabled={!isNextButtonAvailable}
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {'Continue'}
                      </Button>
                      {index !== 0 && (
                        <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                          Back
                        </Button>
                      )}
                    </div>
                  </Box>
                </>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      )}
    </Box>
  );
};

export default MigrationWizard;
