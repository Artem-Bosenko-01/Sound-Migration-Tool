import { UnauthorizedError } from './unauthorized-error';
import { ClientServerError } from './client-server-error';
import { ServerError } from './server-error';
import { User, UserInfo } from './models';

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
  const token = getToken()
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
  const token = getToken()
  const response = await sendRequest("/update-tokens", {
    method: 'PUT',
    headers: new Headers({ Authorization: `Bearer ${token}` }),
    body: JSON.stringify({ spotifyAuthToken: spotifyToken, youtubeMusicAuthToken: ytMusicToken }),
  });
  checkResponseOnClientOrServerError(response);
}

export const fetchPlaylists = (selectedPlatform: string): Promise<Array<PlaylistModel>> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        {
          id: '21232',
          name: 'test1',
          amountOfSongs: 5,
          titleImageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png',
          songsNames: ['song1', 'song2'],
        },
        {
          id: '212365',
          name: 'playlist',
          amountOfSongs: 15,
          songsNames: ['song1'],
        },
      ]);
    }, 6000),
  );
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
