import React, { useCallback, useState } from 'react';
import { Alert, Box, Button } from '@mui/material';
import { Card } from '@mui/material';
import { CardContent } from '@mui/material';
import { Grid } from '@mui/material';
import { Typography } from '@mui/material';
import icons from '../Icons';
import { UserInfo } from '../api-service/models';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getUserInfo, updateTokens } from '../api-service';
import CircularProgress from '@mui/material/CircularProgress';
import { LOG_IN_SPOTIFY_URL, LOG_IN_YOUTUBE_DATA_URL } from '../constants';

const UserSettings = () => {
  const spotifyToken = window.localStorage.getItem('spotify_token');
  const youtubeToken = window.localStorage.getItem('youtube_data_token');
  const [showAlert, setShowAlert] = useState(!!youtubeToken || !!spotifyToken);
  const { isLoading, data: userInfo } = useQuery<UserInfo>('get-user-info', getUserInfo, {
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const queryClient = useQueryClient()
  const { mutate } = useMutation<
    void,
    { message: string },
    { spotifyToken: string | null; ytMusicToken: string | null }
  >(({ spotifyToken, ytMusicToken }: any) => updateTokens({ spotifyToken, ytMusicToken }));

  const saveChanges = useCallback(() => {
    mutate(
      { spotifyToken, ytMusicToken: youtubeToken },
      {
        onSuccess: async () => {
          window.localStorage.removeItem('spotify_token');
          window.localStorage.removeItem('youtube_data_token');
          setShowAlert(false);
          await queryClient.invalidateQueries('get-user-info')
        },
      },
    );
  }, [mutate, queryClient, spotifyToken, youtubeToken]);

  return (
    <Box display={'flex'} flexDirection={'column'} padding={'30px 30px 0 30px'}>
      <Box width={'450px'}>
        <Typography>User Detailed Info</Typography>
        <Card sx={{ marginTop: '5px' }} variant="outlined">
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Typography variant="body1">Full Name</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={9}
                display={'flex'}
                justifyContent={'center'}
                paddingLeft={'0 !important'}
              >
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    {userInfo?.fullName}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <hr />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Typography variant="body1">Email</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={9}
                display={'flex'}
                justifyContent={'center'}
                paddingLeft={'0 !important'}
              >
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    {userInfo?.email}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      <Box width={'550px'} marginTop={'20px'}>
        <Typography>Information about platform authentication tokens</Typography>
        <Card sx={{ marginTop: '5px' }} variant="outlined">
          <CardContent>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sm={3}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>Spotify</Typography>
                <img
                  src={icons['spotify']}
                  alt={'spotify'}
                  style={{ height: '40px', width: '40px' }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={9}
                display={'flex'}
                justifyContent={'center'}
                paddingLeft={'0 !important'}
                marginLeft={'10px !important'}
                style={{ fontSize: '12px', overflow: 'scroll' }}
                maxWidth={'73% !important'}
              >
                {isLoading ? (
                  <CircularProgress />
                ) : userInfo?.spotifyToken ?? spotifyToken ? (
                  userInfo?.spotifyToken ?? spotifyToken
                ) : (
                  <a href={LOG_IN_SPOTIFY_URL} className={'spotify-login-button'}>
                    LOG IN
                  </a>
                )}
              </Grid>
            </Grid>
            <hr />
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sm={3}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>YouTube Music</Typography>
                <img
                  src={icons['youtubeMusic']}
                  alt={'youtubeMusic'}
                  style={{ height: '40px', width: '40px' }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={9}
                display={'flex'}
                justifyContent={'center'}
                paddingLeft={'0 !important'}
                marginLeft={'10px !important'}
                style={{ fontSize: '12px', overflow: 'scroll' }}
                maxWidth={'73% !important'}
              >
                {isLoading ? (
                  <CircularProgress />
                ) : userInfo?.ytMusicToken ?? youtubeToken ? (
                  userInfo?.ytMusicToken ?? youtubeToken
                ) : (
                  <a href={LOG_IN_YOUTUBE_DATA_URL} className="google-auth-button">
                    <span className="google-auth-text">Sign in with Google</span>
                  </a>
                )}
              </Grid>
            </Grid>
            {showAlert && (
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <Alert style={{ width: '100%' }} severity="warning">
                  You have unsaved changes
                </Alert>
                <Button
                  style={{ minWidth: '150px', marginLeft: '15px' }}
                  variant="contained"
                  onClick={saveChanges}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default UserSettings;
