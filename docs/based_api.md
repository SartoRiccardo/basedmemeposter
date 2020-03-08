The API is RESTful. In every request, the header must include an `Authorization` field which contains the token.

# Post

## <span style="color: #3EB63E">GET</span> Post by ID

**Endpoint:** `/post/{{id}}`

**Data:**
+ [`Post`](./model.md): The matching post.

---

## <span style="color: #3EB63E">GET</span> Posts by Platform ID

**Endpoint:** `/post/{{id}}/{{platform}}`

**Data:**
+ [`Post`](./model.md): The matching post.

---

## <span style="color: #3EB63E">GET</span> Posts by Platform

**Endpoint:** `/post/{{platform}}`

**Data:**
+ [`Post`](./model.md): The matching post.

---

## <span style="color: #F5A623">POST</span> Upload Post

**Endpoint:** `/post`

**Params:**
+ `platformId`: The post's ID in its original platform.
+ `platform`: The post's original platform.

**Data:**
+ `id`: The newly created post's ID.

---

## <span style="color: #4A90E2">PUT</span> Change Post

**Endpoint:** `/post`

**Params:**
+ `id`: The post's ID.
+ `platformId`: The post's ID in its original platform.
+ `platform`: The post's original platform.

---

## <span style="color: #ED4B48">DEL</span> Delete Post

**Endpoint:** `/post/{{id}}`
