import database.connection


dbc = database.connection.dbc


def insertPost(platform, id):
    q = """
        INSERT INTO Post (id, platform, idOnPlatform)
            VALUES (NULL, :platform, :idOnPlatform);
        """
    q = q.replace(":platform", f"'{platform}'").replace(":idOnPlatform", f"'{id}'")
    dbc.execute(q)
