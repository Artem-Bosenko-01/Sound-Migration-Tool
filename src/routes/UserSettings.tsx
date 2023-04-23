import Box from '@mui/material/Box/Box';
import Card from '@mui/material/Card/Card';
import CardContent from '@mui/material/CardContent/CardContent';
import Grid from '@mui/material/Grid/Grid';
import Typography from '@mui/material/Typography';
import icons from '../Icons';
import GoogleLogin from 'react-google-login';
import React from 'react';
// import { loadAuth2 } from 'gapi-script';

// temporary it will be here
const clientId = '75898408331-4prql5eq7jgha86b82rdtlj4vptrcg2v.apps.googleusercontent.com';
const scopes = ['https://www.googleapis.com/auth/youtube.force-ssl'];

// loadAuth2(
//   'client:auth2',
//   '75898408331-4prql5eq7jgha86b82rdtlj4vptrcg2v.apps.googleusercontent.com',
//   'https://www.googleapis.com/auth/youtube.force-ssl',
// );

const UserSettings = () => {
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
                <Typography variant="body2" color="textSecondary">
                  Johnatan Smith
                </Typography>
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
                <Typography variant="body2" color="textSecondary">
                  example@example.com
                </Typography>
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
              >
                <a href={'/'} className={'spotify-login-button'}>
                  LOG IN
                </a>
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
              >
                <GoogleLogin
                  clientId={clientId}
                  buttonText="Authorize with Google"
                  onSuccess={() => {}}
                  onFailure={() => {}}
                  scope={scopes.join(' ')}
                  responseType="token"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default UserSettings;
