import praw
import config


def get_sub_image_posts(sub):
    reddit = praw.Reddit(
        client_id=config.config("reddit", "client-id"),
        client_secret=config.config("reddit", "client-secret"),
        user_agent=config.config("reddit", "user-agent")
    )
    reddit.read_only = True

    ret = []
    submissions = reddit.subreddit(sub).hot()
    for s in submissions:
        if hasattr(s, "post_hint") and s.post_hint == "image" and not s.stickied:
            ret.append(s)
    return ret

