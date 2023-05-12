import * as React from 'react';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem/ListItem';
import Avatar from '@mui/material/Avatar/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box/Box';
import { migratePlaylists, PlaylistModel } from '../api-service';
import formatPlatformName from '../utils/formatPlatformName';
import icons from '../Icons';
import ErrorModal from './ErrorModal';

type Props = {
  setNextButtonAvailable: (isDisabled: boolean) => void;
  selectedPlaylists: Array<PlaylistModel>;
  selectedDstPlatform: keyof typeof icons;
  onSuccessMigration: () => void;
};

const MigrationProcessingStep = ({
  setNextButtonAvailable,
  selectedPlaylists,
  selectedDstPlatform,
  onSuccessMigration,
}: Props) => {
  const [isMigrationProcessing, setMigrationProcessing] = useState(false);
  useEffect(() => {
    setNextButtonAvailable(false);
  }, [setNextButtonAvailable]);

  const { mutate: migrate, error } = useMutation<
    string,
    { message: string },
    { playlists: Array<PlaylistModel>; selectedDstPlatform: string }
  >(({ playlists, selectedDstPlatform }) => migratePlaylists(playlists, selectedDstPlatform));

  const handleConfirm = () => {
    setMigrationProcessing(true);
    migrate(
      { playlists: selectedPlaylists, selectedDstPlatform },
      {
        onSuccess: onSuccessMigration,
        onSettled: () => setMigrationProcessing(false),
      },
    );
  };

  return isMigrationProcessing ? (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  ) : (
    <>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Are you sure you want to migrate to {formatPlatformName(selectedDstPlatform)} next
        playlists:
      </Typography>
      <List>
        {selectedPlaylists.map(({ name, titleImageUrl, amountOfSongs }) => (
          <ListItem>
            <ListItemAvatar>
              <Avatar alt={name} src={titleImageUrl} sx={{ width: 56, height: 56 }}>
                {name.slice(0, 1)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{ marginLeft: '10px' }}
              primary={name}
              secondary={`Contains ${amountOfSongs} songs.`}
            />
          </ListItem>
        ))}
      </List>
      <Button sx={{ marginBottom: '20px' }} variant={'outlined'} onClick={handleConfirm}>
        Confirm
      </Button>
      <ErrorModal show={!!error} message={error?.message ?? ''} />
    </>
  );
};

export default MigrationProcessingStep;
