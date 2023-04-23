import icons from '../Icons';

const formattedValues = {
  spotify: "Spotify",
  youtubeMusic: "YouTube Music"
}
const formatPlatformName = (platformName: keyof typeof icons) => formattedValues[platformName]

export default formatPlatformName