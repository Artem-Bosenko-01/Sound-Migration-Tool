import React from 'react';
import ChoosePlatformStep from './ChoosePlatformStep';
import icons from '../Icons';
import ChoosePlaylistsStep from './ChoosePlaylistsStep';
import MigrationProcessingStep from './MigrationProcessingStep';
import { PlaylistModel } from '../api-service';
import { UserInfo } from '../api-service/models';

type StepRendererProps = {
  setSelectedSrcPlatform: (platformName?: keyof typeof icons) => void;
  setSelectedDstPlatform: (platformName?: keyof typeof icons) => void;
  selectedSrcPlatform?: keyof typeof icons;
  selectedDstPlatform?: keyof typeof icons;
  setNextButtonAvailable: (isDisabled: boolean) => void;
  selectedPlaylists: Array<PlaylistModel>;
  setSelectedPlaylists: (playlists: Array<PlaylistModel>) => void;
  onSuccessMigration: () => void
  userInfo: UserInfo
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
                     userInfo
    }) => (
      <ChoosePlaylistsStep
        selectedSrcPlatform={selectedSrcPlatform!}
        selectedPlaylists={selectedPlaylists}
        setSelectedPlaylists={setSelectedPlaylists}
        setNextButtonAvailable={setNextButtonAvailable}
        userInfo={userInfo}
      />
    ),
  },
  {
    label: 'Migration processing',
    stepRenderer: ({ setNextButtonAvailable, selectedPlaylists, selectedDstPlatform, onSuccessMigration, userInfo }) => (
      <MigrationProcessingStep
        setNextButtonAvailable={setNextButtonAvailable}
        selectedPlaylists={selectedPlaylists}
        selectedDstPlatform={selectedDstPlatform!}
        onSuccessMigration={onSuccessMigration}
        userInfo={userInfo}
      />
    ),
  },
];

export default steps;
