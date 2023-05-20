import { UnauthorizedError } from './unauthorized-error';
import { ClientServerError } from './client-server-error';
import { ServerError } from './server-error';
import { User, UserInfo } from './models';
import icons from '../Icons';

export type PlaylistModel = {
  id: string;
  name: string;
  amountOfSongs: number;
  titleImageUrl?: string;
  songsNames: Array<string>;
};

export const login = async (email: string, password: string) => {
  const response = await sendRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ loginName: email, password }),
  });
  if (response.status === 401) {
    throw new UnauthorizedError();
  }
  checkResponseOnClientOrServerError(response);
  const responseBody = await response.json();
  window.localStorage.setItem('token', responseBody.token);
};

export async function register({ email, password, firstName, lastName }: User) {
  const response = await sendRequest('/register', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, loginName: email, password }),
  });

  if (response.status === 422) {
    const errorMessages = await response.json();
    throw new Error(errorMessages);
  }
  checkResponseOnClientOrServerError(response);
}

export async function getUserInfo(): Promise<UserInfo> {
  const token = getToken();
  const response = await sendRequest('/user', {
    method: 'GET',
    headers: new Headers({ Authorization: `Bearer ${token}` }),
  });

  checkResponseOnClientOrServerError(response);
  const { firstName, lastName, loginName, spotifyAuthToken, youtubeMusicAuthToken } =
    await response.json();
  return {
    fullName: `${firstName} ${lastName}`,
    email: loginName,
    spotifyToken: spotifyAuthToken,
    ytMusicToken: youtubeMusicAuthToken,
  };
}

export async function updateTokens({ spotifyToken, ytMusicToken }: Partial<UserInfo>) {
  const token = getToken();
  const response = await sendRequest('/update-tokens', {
    method: 'PUT',
    headers: new Headers({ Authorization: `Bearer ${token}` }),
    body: JSON.stringify({ spotifyAuthToken: spotifyToken, youtubeMusicAuthToken: ytMusicToken }),
  });
  checkResponseOnClientOrServerError(response);
}

export const fetchPlaylists = async (
  selectedPlatform: keyof typeof icons,
  userInfo: UserInfo,
): Promise<Array<PlaylistModel>> => {
  if (selectedPlatform === 'spotify') {
    const spotifyResponse = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${userInfo.spotifyToken}`,
      },
    });

    const playlistModel = await spotifyResponse.json();
    const playlists = playlistModel.items;

    return playlists.map((playlist: any) => ({
      id: playlist.id,
      name: playlist.name,
      amountOfSongs: playlist.tracks.total,
      titleImageUrl: playlist.images[0].url,
      songsNames: [],
    }));
  } else if (selectedPlatform === 'youtubeMusic') {
    const ytMusicResponse = await fetch(
      'https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true',
      {
        headers: {
          Authorization: `Bearer ${userInfo.ytMusicToken}`,
        },
      },
    );

    const playlistModel = await ytMusicResponse.json();
    const playlists = playlistModel.items;

    const playlistsWithAmountOfSongs = []
    for (const playlist of playlists) {
      const playlistId = playlist.id;
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=0`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${userInfo.ytMusicToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      let playlistItems = await response.json();
      const videoCount = playlistItems.pageInfo.totalResults;
      playlistsWithAmountOfSongs.push({
        id: playlistId,
        name: playlist.snippet.title,
        amountOfSongs: videoCount,
        titleImageUrl: playlist.snippet.thumbnails.default.url,
        songsNames: [],
      })
    }
    return playlistsWithAmountOfSongs
  }
  throw new Error('unsupported platform selected');
};

export const migratePlaylists = (
  playlists: Array<PlaylistModel>,
  selectedDstPlatform: string,
): Promise<string> => {
  // return new Promise((resolve => setTimeout(() => resolve("GOOD"), 6000)))
  return new Promise((resolve, reject) =>
    setTimeout(
      () =>
        reject({
          message: 'Your authentication token for YouTube Music expired. Please generate new token',
        }),
      2000,
    ),
  );
};

const sendRequest = async (urlString: string, init: RequestInit) => {
  try {
    return await fetch('http://localhost:8080/SoundMigrationTool/1.0' + urlString, init);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const onNavigateAfterError = (callback: () => void) => {
  window.addEventListener('unauthorizedUserError', callback);
};

const checkResponseOnClientOrServerError = (response: Response) => {
  if (response.status === 401) {
    window.location.assign('/login');
  }

  if (response.status === 500) {
    throw new ServerError();
  }

  if (response.status >= 400 && response.status < 500) {
    throw new ClientServerError(response.status);
  }
};

const getToken = () => window.localStorage.getItem('token');
