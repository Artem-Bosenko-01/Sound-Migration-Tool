import React from 'react';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import usePersistentState from './localStorage/usePersistanceState';
import { loadAuth2 } from 'gapi-script';

const clientId = '75898408331-4prql5eq7jgha86b82rdtlj4vptrcg2v.apps.googleusercontent.com';
const scopes = ['https://www.googleapis.com/auth/youtube.force-ssl'];

loadAuth2(
  'client:auth2',
  '75898408331-4prql5eq7jgha86b82rdtlj4vptrcg2v.apps.googleusercontent.com',
  'https://www.googleapis.com/auth/youtube.force-ssl',
);

const YouTubeAuth = () => {
  const [accessToken, setAccessToken] = usePersistentState<string | null>(
    'youtube-authentication',
    { version: 1, value: null },
  );

  const handleAuthSuccess = (response: GoogleLoginResponse) => {
    const accessToken = response.accessToken;
    setAccessToken(accessToken);
  };

  const handleAuthFailure = (response: string) => {
    console.log('Authorization failed:', response);
  };

  return (
    <div>
      {accessToken ? (
        <div>You are authorized with access token: {accessToken}</div>
      ) : (
        <GoogleLogin
          clientId={clientId}
          buttonText="Authorize with Google"
          // @ts-ignore
          onSuccess={handleAuthSuccess}
          onFailure={handleAuthFailure}
          scope={scopes.join(' ')}
          responseType="token"
        />
      )}
    </div>
  );
};

export default YouTubeAuth;
