import twitter
from config import config


def get_user_image_statuses(user):
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

    ret = []
    for s in statuses:
        if s.media:
            ret.append(s)
    return ret
