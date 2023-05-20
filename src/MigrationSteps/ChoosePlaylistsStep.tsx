import icons from '../Icons';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import * as React from 'react';
import { fetchPlaylists, PlaylistModel } from '../api-service';
import { UserInfo } from '../api-service/models';

type Props = {
  selectedSrcPlatform: keyof typeof icons;
  selectedPlaylists: Array<PlaylistModel>;
  setSelectedPlaylists: (playlists: Array<PlaylistModel>) => void;
  setNextButtonAvailable: (isDisable: boolean) => void;
  userInfo: UserInfo
};

const ChoosePlaylistsStep = ({
  selectedSrcPlatform,
  selectedPlaylists,
  setSelectedPlaylists,
  setNextButtonAvailable,
  userInfo
}: Props) => {
  useEffect(() => {
    setNextButtonAvailable(false);
    selectedPlaylists.length > 0 && setNextButtonAvailable(true);
  }, [setNextButtonAvailable, selectedPlaylists]);

  //fetch playlists for source directory on render and show loader until we wait for response
  const { isLoading, data: playlists } = useQuery<Array<PlaylistModel>>(
    'user-playlists',
    async () => await fetchPlaylists(selectedSrcPlatform, userInfo)
  );

  const handleToggle = (playlist: PlaylistModel) => () => {
    const currentIndex = selectedPlaylists.findIndex(p => p.id === playlist.id);
    const newChecked = [...selectedPlaylists];

    if (currentIndex === -1) {
      newChecked.push(playlist);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedPlaylists(newChecked);
  };

  return isLoading ? (
    <CircularProgress />
  ) : (
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {playlists?.map(({ id, name, amountOfSongs, titleImageUrl }) => {
        return (
          <ListItem
            disabled={amountOfSongs < 1}
            key={name}
            secondaryAction={
              <Checkbox
                disabled={amountOfSongs < 1}
                edge="end"
                onChange={handleToggle(playlists.find(p => p.id === id)!)}
                checked={selectedPlaylists.indexOf(playlists.find(p => p.id === id)!) !== -1}
              />
            }
            disablePadding
          >
            <ListItemButton disabled={amountOfSongs < 1} onClick={handleToggle(playlists.find(p => p.id === id)!)}>
              <ListItemAvatar>
                <Avatar alt={name} src={titleImageUrl} sx={{ width: 56, height: 56 }}>
                  {name.slice(0, 1)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText sx={{ marginLeft: '10px' }} primary={name} />
              <ListItemText
                sx={{ marginLeft: '5px' }}
                secondary={`contains ${amountOfSongs} songs`}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default ChoosePlaylistsStep;
