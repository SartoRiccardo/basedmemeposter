import axios from "axios";

export async function getUserAvatar(username) {
  try {
    return "https://i.imgur.com/1jSr04e.jpg"; // They IP banned me from using this API while logged out
    // eslint-disable-next-line
    const response = await axios.get(`https://www.instagram.com/${username}/?__a=1`);
    return response.data.graphql.user.profile_pic_url;
  }
  // eslint-disable-next-line
  catch(e) {
    return null;
  }
}
