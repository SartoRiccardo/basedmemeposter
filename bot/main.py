import apis.imgur as imgur
import apis.based as based

err = open("test/error.csv", "w")
err_count = 0

top = imgur.topGalleries()


def isInRange(ratio):
    return 9/16 <= ratio <= 16/9


for g in top:
    error_message = None
    if not g.is_album:
        ratio = g.width / g.height
        if not isInRange(ratio):
            error_message = "Invalid ratio in image."
    else:
        if g.images_count > 10:
            error_message = "Too many album images."
        else:
            gallery = imgur.getGallery(g.id)
            for i in gallery:
                image_ratio = i.width / i.height
                if not isInRange(image_ratio):
                    error_message = "Invalid ratio on one of the album images."

    if error_message is None:
        try:
            print(based.insertPost(g.id, "IMGUR"))
        except Exception as e:
            print("ERROR", e)
    else:
        err.write(f"{g.id};{error_message}\n")
        err_count = err_count + 1

err.close()

print(f"Analyzed {len(top)} galleries with {err_count} errors")
