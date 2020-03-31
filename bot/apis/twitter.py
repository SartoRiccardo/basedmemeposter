from config import config
import apis.based

import twitter


def userImageStatuses(user):
    """
    Gets all image non-reply elegible tweets from an user.
    :param user: str: A Twitter username
    :return: BasedPost[]: A list of elegible posts
    """
    api = twitter.Api(
        consumer_key=config("twitter", "consumer-key"),
        consumer_secret=config("twitter", "consumer-secret"),
        access_token_key=config("twitter", "access-key"),
        access_token_secret=config("twitter", "access-secret")
    )

    statuses = api.GetUserTimeline(
        screen_name=user,
        include_rts=False,
        exclude_replies=True
    )

    max_ratio = 16/9
    min_ratio = 9/16
    ret = []
    for s in statuses:
        if s.media and len(s.media) == 1 and s.media[0].type == "photo":
            photo = s.media[0]
            original_url = f"https://twitter.com/{user}/status/{s.id_str}"
            ratio = None
            for size in photo.sizes:
                if size != "thumb":
                    ratio = photo.sizes[size]["w"] / photo.sizes[size]["h"]

            if ratio and min_ratio < ratio < max_ratio:
                ret.append(apis.based.BasedPost(
                    "twitter", s.id_str, original_url, photo.media_url_https
                ))
    return ret
