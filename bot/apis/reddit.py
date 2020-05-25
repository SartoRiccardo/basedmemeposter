from config import config
import apis.mastermemed

import praw


def topSubImagePosts(sub):
    """
    Fetches a subreddit's top Instagram-postable submissions.
    :param sub: str: The name of the subreddit.
    :return: mastermemed.Post[]: A list of elegible posts.
    """
    reddit = praw.Reddit(
        client_id=config("reddit", "client-id"),
        client_secret=config("reddit", "client-secret"),
        user_agent=config("reddit", "user-agent")
    )
    reddit.read_only = True
    submissions = reddit.subreddit(sub).hot()

    max_ratio = 5/4
    min_ratio = 1/max_ratio
    ret = []
    for s in submissions:
        if hasattr(s, "post_hint") and s.post_hint == "image" and not s.stickied and \
                not s.over_18:
            source = s.preview["images"][0]["source"]
            if min_ratio <= source["width"]/source["height"] <= max_ratio:
                post = apis.mastermemed.Post(
                    "reddit", s.id, f"https://reddit.com{s.permalink}", s.url, s.url
                )
                ret.append(post)
    return ret

