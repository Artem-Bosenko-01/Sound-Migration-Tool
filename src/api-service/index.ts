import { UnauthorizedError } from './unauthorized-error';
import { ClientServerError } from './client-server-error';
import { ServerError } from './server-error';
import { User, UserInfo } from './models';
import icons from '../Icons';
import { YOUTUBE_DATA_ID } from '../constants';

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

    const playlistsWithAmountOfSongs = [];

    for (const playlist of playlists) {
      const playlistId = playlist.id;
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + userInfo.spotifyToken,
          'Content-Type': 'application/json',
        },
      });
      let playlistItems = await response.json();

      playlistsWithAmountOfSongs.push({
        id: playlistId,
        name: playlist.name,
        amountOfSongs: playlist.tracks.total,
        titleImageUrl: playlist.images[0].url,
        songsNames: playlistItems.items.map((item: any) => item.track.name),
      });
    }
    return playlistsWithAmountOfSongs;
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

    const playlistsWithAmountOfSongs = [];
    for (const playlist of playlists) {
      const playlistId = playlist.id;
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_DATA_ID}`,
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
        songsNames: playlistItems.items.map((item: any) => item.snippet.title),
      });
    }
    return playlistsWithAmountOfSongs;
  }
  throw new Error('unsupported platform selected');
};

export const migratePlaylists = async ({
  playlists,
  selectedDstPlatform,
  userInfo,
}: {
  playlists: Array<PlaylistModel>;
  selectedDstPlatform: keyof typeof icons;
  userInfo: UserInfo;
}): Promise<void> => {
  for (const playlist of playlists) {
    if (selectedDstPlatform === 'spotify') {
      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${userInfo.spotifyToken}`,
        },
      });

      const data = await userResponse.json();
      const userId = data.id;

      const createPlaylistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userInfo.spotifyToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: playlist.name,
            public: true,
            collaborative: false,
            description: 'Autogenerated playlist',
          }),
        },
      );

      if (createPlaylistResponse.ok) {
        const createdPlaylistInfo = await createPlaylistResponse.json();

        for (let songName of playlist.songsNames) {
          const findSongResponse = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(songName)}&type=track`,
            {
              headers: {
                Authorization: `Bearer ${userInfo.spotifyToken}`,
              },
            },
          );

          if (findSongResponse.ok) {
            const data = await findSongResponse.json();
            const tracks = data.tracks.items;

            if (tracks.length > 0) {
              const song = tracks[0];
              const response = await fetch(
                `https://api.spotify.com/v1/playlists/${createdPlaylistInfo.id}/tracks`,
                {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${userInfo.spotifyToken}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    uris: [`spotify:track:${song.id}`],
                  }),
                },
              );

              if (!response.ok) {
                throw new Error(`Error adding song to the playlist: ${response.statusText}`);
              }
            } else {
              console.log('Song not found.');
            }
          } else {
            console.error(
              'Error searching song:',
              findSongResponse.status,
              findSongResponse.statusText,
            );
          }
        }
      } else {
        throw new Error(
          `Error creating playlist: ${createPlaylistResponse.status} ${createPlaylistResponse.statusText}`,
        );
      }
    } else if (selectedDstPlatform === 'youtubeMusic') {
      const createPlaylistResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet&key=${YOUTUBE_DATA_ID}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userInfo.ytMusicToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            snippet: {
              title: playlist.name,
              description: 'Autogenerated playlist',
            },
          }),
        },
      );

      if (createPlaylistResponse.ok) {
        const createdPlaylistInfo = await createPlaylistResponse.json();

        for (let songName of playlist.songsNames) {
          const findSongResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
              songName,
            )}&type=video&key=${YOUTUBE_DATA_ID}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${userInfo.ytMusicToken}`,
                'Content-Type': 'application/json',
              },
            },
          );
          if (findSongResponse.ok) {
            const data = await findSongResponse.json();
            const tracks = data.items;
            if (tracks.length > 0) {
              const song = tracks[0];
              const response = await fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=${YOUTUBE_DATA_ID}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.ytMusicToken}`,
                  },
                  body: JSON.stringify({
                    snippet: {
                      playlistId: createdPlaylistInfo.id,
                      resourceId: {
                        kind: 'youtube#video',
                        videoId: song.id.videoId,
                      },
                    },
                  }),
                },
              );
              if (!response.ok) {
                throw new Error(`Error adding song to the playlist: ${response.statusText}`);
              }
            } else {
              console.log('Song not found.');
            }
          } else {
            console.error(
              'Error searching song:',
              findSongResponse.status,
              findSongResponse.statusText,
            );
          }
        }
      } else {
        throw new Error(
          `Error creating playlist: ${createPlaylistResponse.status} ${createPlaylistResponse.statusText}`,
        );
      }
    }
  }

  // return new Promise((resolve => setTimeout(() => resolve("GOOD"), 6000)))
  // return new Promise((resolve, reject) =>
  //   setTimeout(
  //     () =>
  //       reject({
  //         message: 'Your authentication token for YouTube Music expired. Please generate new token',
  //       }),
  //     2000,
  //   ),
  // );
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
