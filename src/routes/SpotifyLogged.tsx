import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import routeNames from './routeNames';

const SpotifyLogged = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.hash.length > 0) {
      const formattedStr = window.location.hash.replace(/^./, '');
      const tokenInfo = formattedStr.split('&');
      const token = tokenInfo[0].split('=')[1];
      window.localStorage.setItem("spotify_token", token)
      navigate(routeNames.userSettings)
    }
  }, [navigate]);
  return (<></>)
}

export default SpotifyLogged