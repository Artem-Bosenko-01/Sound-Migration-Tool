import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Paper } from '@mui/material';
import ChoosePlatformStep from './ChoosePlatformStep';
import icons from '../Icons';
import ChoosePlaylistsStep from './ChoosePlaylistsStep';
import MigrationProcessingStep from './MigrationProcessingStep';
import { PlaylistModel } from '../api-service';

type StepRendererProps = {
  onReset: () => void;
  setSelectedSrcPlatform: (platformName?: keyof typeof icons) => void;
  setSelectedDstPlatform: (platformName?: keyof typeof icons) => void;
  selectedSrcPlatform?: keyof typeof icons;
  selectedDstPlatform?: keyof typeof icons;
  setNextButtonAvailable: (isDisabled: boolean) => void;
  selectedPlaylists: Array<PlaylistModel>;
  setSelectedPlaylists: (playlists: Array<PlaylistModel>) => void;
  onSuccessMigration: () => void
};

type Step = {
  label: string;
  stepRenderer: (props: StepRendererProps) => JSX.Element;
};
type Steps = Array<Step>;
const steps: Steps = [
  {
    label: 'Choose source Platform',
    stepRenderer: ({ selectedSrcPlatform, setSelectedSrcPlatform, setNextButtonAvailable }) => (
      <ChoosePlatformStep
        selectedPlatform={selectedSrcPlatform}
        setSelectedPlatform={setSelectedSrcPlatform}
        setNextButtonAvailable={setNextButtonAvailable}
      />
    ),
  },
  {
    label: 'Choose destination platform',
    stepRenderer: ({
      selectedDstPlatform,
      setSelectedDstPlatform,
      selectedSrcPlatform,
      setNextButtonAvailable,
    }) => (
      <ChoosePlatformStep
        selectedPlatform={selectedDstPlatform}
        setSelectedPlatform={setSelectedDstPlatform}
        isDisabledHandler={(currentPlatform) => currentPlatform === selectedSrcPlatform}
        setNextButtonAvailable={setNextButtonAvailable}
      />
    ),
  },
  {
    label: 'Choose playlists',
    stepRenderer: ({
      selectedSrcPlatform,
      selectedPlaylists,
      setSelectedPlaylists,
      setNextButtonAvailable,
    }) => (
      <ChoosePlaylistsStep
        selectedSrcPlatform={selectedSrcPlatform!}
        selectedPlaylists={selectedPlaylists}
        setSelectedPlaylists={setSelectedPlaylists}
        setNextButtonAvailable={setNextButtonAvailable}
      />
    ),
  },
  {
    label: 'Migration processing',
    stepRenderer: ({ setNextButtonAvailable, selectedPlaylists, selectedDstPlatform, onSuccessMigration }) => (
      <MigrationProcessingStep
        setNextButtonAvailable={setNextButtonAvailable}
        selectedPlaylists={selectedPlaylists}
        selectedDstPlatform={selectedDstPlatform!}
        onSuccessMigration={onSuccessMigration}
      />
    ),
  },
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
