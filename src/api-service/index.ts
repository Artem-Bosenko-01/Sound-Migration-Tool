export type PlaylistModel = {
  id: string;
  name: string;
  amountOfSongs: number;
  titleImageUrl?: string
};

export const fetchPlaylists = (selectedPlatform: string): Promise<Array<PlaylistModel>> => {
  return new Promise((resolve) => setTimeout(() => {
    resolve([{
      id: "21232",
      name: "test1",
      amountOfSongs: 5,
      titleImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png"
    }, {
      id: "212365",
      name: "playlist",
      amountOfSongs: 15
    }])
  }, 2000));
};


export const migratePlaylists = (playlists: Array<PlaylistModel>, selectedDstPlatform: string):Promise<string> => {
  return new Promise((resolve => setTimeout(() => resolve("GOOD"), 2000)))
}