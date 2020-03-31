from config import config
import apis.based

import praw


def topSubImagePosts(sub):
    """
    Fetches a subreddit's top Instagram-postable submissions.
    :param sub: str: The name of the subreddit.
    :return: BasedPost[]: A list of elegible posts.
    """
    reddit = praw.Reddit(
        client_id=config("reddit", "client-id"),
        client_secret=config("reddit", "client-secret"),
        user_agent=config("reddit", "user-agent")
    )
    reddit.read_only = True
    submissions = reddit.subreddit(sub).hot()

    max_ratio = 16/9
    min_ratio = 9/16
    ret = []
    for s in submissions:
        if hasattr(s, "post_hint") and s.post_hint == "image" and not s.stickied and \
                not s.over_18:
            source = s.preview["images"][0]["source"]
            if min_ratio <= source["width"]/source["height"] <= max_ratio:
                post = apis.based.BasedPost(
                    "reddit", s.id, f"https://reddit.com{s.permalink}", s.url
                )
                ret.append(post)
    return ret

