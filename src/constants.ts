export const SPOTIFY_CLIENT_ID = "fd621971ed3545a1b42e450cdc20c07a"
export const SPOTIFY_CLIENT_SECRET = "15fa4d98c46c4e31b64a91735229aaf1"
export const SPOTIFY_SCOPES = ['playlist-read-private', 'playlist-modify-public', 'user-read-playback-position', 'user-read-private']
const SPOTIFY_REDIRECT = "http://localhost:3000/spotify-logged"

export const YOUTUBE_DATA_ID = "75898408331-4prql5eq7jgha86b82rdtlj4vptrcg2v.apps.googleusercontent.com"
export const YOUTUBE_DATA_CLIENT_SECRET = "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"
export const YOUTUBE_DATA_SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
const YOUTUBE_DATA_REDIRECT = "http://localhost:3000/youtube-logged"

export const LOG_IN_SPOTIFY_URL = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURI(SPOTIFY_REDIRECT)}&show_dialog=true&scope=${SPOTIFY_SCOPES.join(' ')}`
export const LOG_IN_YOUTUBE_DATA_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${YOUTUBE_DATA_ID}&response_type=token&redirect_uri=${encodeURI(YOUTUBE_DATA_REDIRECT)}&scope=${YOUTUBE_DATA_SCOPES.join(' ')}`