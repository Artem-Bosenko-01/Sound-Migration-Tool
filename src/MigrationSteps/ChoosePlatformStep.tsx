import { useEffect } from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import icons from '../Icons';
import Tooltip from '@mui/material/Tooltip/Tooltip';

type Props = {
  selectedPlatform?: keyof typeof icons;
  setSelectedPlatform: (platformName: keyof typeof icons) => void;
  isDisabledHandler?: (currentPlatform: keyof typeof icons) => boolean;
  setNextButtonAvailable: (value: boolean) => void;
};
const ChoosePlatformStep = ({
  selectedPlatform,
  setSelectedPlatform,
  isDisabledHandler,
  setNextButtonAvailable,
}: Props) => {
  useEffect(() => {
    setNextButtonAvailable(!!selectedPlatform);
  }, [selectedPlatform, setNextButtonAvailable]);

  return (
    <ToggleButtonGroup
      color="primary"
      value={selectedPlatform}
      exclusive
      onChange={async (_, value) => {
        setSelectedPlatform(value);
        setNextButtonAvailable(true);
      }}
      aria-label="Platform"
    >
      {(Object.keys(icons) as Array<keyof typeof icons>).map((key) =>
        isDisabledHandler?.(key) ? (
          <Tooltip arrow placement={'bottom'} title={'Platform already selected'}>
            <ToggleButton
              value={key}
              disabled
              sx={{
                '&.Mui-disabled': {
                  pointerEvents: 'all',
                },
              }}
            >
              <img src={icons[key]} alt={key} style={{ height: '100px', width: '100px' }} />
            </ToggleButton>
          </Tooltip>
        ) : (
          <ToggleButton value={key}>
            <img src={icons[key]} alt={key} style={{ height: '100px', width: '100px' }} />
          </ToggleButton>
        ),
      )}
    </ToggleButtonGroup>
  );
};

export default ChoosePlatformStep;
