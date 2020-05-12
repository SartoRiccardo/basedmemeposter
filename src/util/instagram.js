import axios from "axios";

export async function getUserAvatar(username) {
  try {
    if(process.env.NODE_ENV === "development") {
      return "https://i.imgur.com/1jSr04e.jpg";
    }
    const response = await axios.get(`https://www.instagram.com/${username}/?__a=1`);
    return response.data.graphql.user.profile_pic_url;
  }
  catch(e) {
    return null;
  }
}
