import icons from '../Icons';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

type Props = {
  selectedPlatform?: keyof typeof icons;
  setSelectedPlatform: (platformName: keyof typeof icons) => void;
  isDisabledHandler?: (currentPlatform: keyof typeof icons) => boolean;
};
const ChoosePlatformStep = ({
  selectedPlatform,
  setSelectedPlatform,
  isDisabledHandler,
}: Props) => {
  return (
    <ToggleButtonGroup
      color="primary"
      value={selectedPlatform}
      exclusive
      onChange={(_, value) => setSelectedPlatform(value)}
      aria-label="Platform"
    >
      {(Object.keys(icons) as Array<keyof typeof icons>).map((key) => (
        <ToggleButton value={key} disabled={isDisabledHandler?.(key)}>
          <img src={icons[key]} alt={key} style={{ height: '100px', width: '100px' }} />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ChoosePlatformStep;
