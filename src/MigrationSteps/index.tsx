import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Paper } from '@mui/material';
import ChoosePlatformStep from './ChoosePlatformStep';
import icons from '../Icons';

type StepRendererProps = {
  onReset: () => void;
  setSelectedSrcPlatform: (platformName?: keyof typeof icons) => void;
  setSelectedDstPlatform: (platformName?: keyof typeof icons) => void;
  selectedSrcPlatform?: keyof typeof icons;
  selectedDstPlatform?: keyof typeof icons;
};

type Step = {
  label: string;
  stepRenderer: (props: StepRendererProps) => JSX.Element;
};
type Steps = Array<Step>;
const steps: Steps = [
  {
    label: 'Choose source Platform',
    stepRenderer: ({ selectedSrcPlatform, setSelectedSrcPlatform }) => (
      <ChoosePlatformStep
        selectedPlatform={selectedSrcPlatform}
        setSelectedPlatform={setSelectedSrcPlatform}
      />
    ),
  },
  {
    label: 'Choose destination platform',
    stepRenderer: ({ selectedDstPlatform, setSelectedDstPlatform, selectedSrcPlatform }) => (
      <ChoosePlatformStep
        selectedPlatform={selectedDstPlatform}
        setSelectedPlatform={setSelectedDstPlatform}
        isDisabledHandler={(currentPlatform) => currentPlatform === selectedSrcPlatform}
      />
    ),
  },
  { label: 'Choose playlists', stepRenderer: () => <>Choose playlists</> },
  { label: 'Migration processing', stepRenderer: () => <>Migration processing</> },
  {
    label: 'Migration completed!',
    stepRenderer: ({ onReset }) => (
      <Paper square elevation={0} sx={{ p: 3 }}>
        <Typography>All steps completed - you&apos;re finished</Typography>
        <Button onClick={onReset} sx={{ mt: 1, mr: 1 }}>
          Start new migration
        </Button>
      </Paper>
    ),
  },
];

export default steps;
