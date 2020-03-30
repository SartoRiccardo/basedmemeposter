import json


def get_json_from_file(file, platform, key):
    data = json.loads(file.read())
    ret = data[platform][key]
    file.close()
    return ret


def config(platform, key):
    config = open("./config.json")
    return get_json_from_file(config, platform, key)


def collection(platform, key):
    collection = open("./collection.json")
    return get_json_from_file(collection, platform, key)
