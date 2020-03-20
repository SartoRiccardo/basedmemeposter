The API is RESTful. In every request, the header must include an `Authorization` field which contains the token.

# Post

## <span style="color: #3EB63E">GET</span> Post by ID

**Endpoint:** `/post/{{id}}`

**Data:**
+ `post`: The matching post.

---

## <span style="color: #3EB63E">GET</span> Posts by Platform ID

**Endpoint:** `/post/{{id}}/{{platform}}`

**Data:**
+ `post`: The matching post.

---

## <span style="color: #3EB63E">GET</span> Posts by Platform

**Endpoint:** `/post/{{platform}}`

**Data:**
+ `post`: The matching post.

---

## <span style="color: #F5A623">POST</span> Upload Post

**Endpoint:** `/post`

**Params:**
+ `platform_id`: The post's ID in its original platform.
+ `platform`: The post's original platform.

**Data:**
+ `post_id`: The newly created post's ID.

---

## <span style="color: #4A90E2">PUT</span> Change Post

**Endpoint:** `/post`

**Params:**
+ `id`: The post's ID.
+ `platform_id`: The post's ID in its original platform.
+ `platform`: The post's original platform.

---

## <span style="color: #ED4B48">DEL</span> Delete Post

**Endpoint:** `/post/{{id}}`

# Schedule

## <span style="color: #3EB63E">GET</span> User Schedule

**Endpoint:** `/schedule/account/{{id}}`

**Params:**

+ `show_only_scheduled`: If set, shows only the schedules with a date higher than the current one.

**Data:**

+ `schedule`: The account's schedule.

---

## <span style="color: #3EB63E">GET</span> Schedule by ID.

**Endpoint:** `/schedule/{{id}}`

**Data:**

+ `schedule`: The matched schedule.

---

## <span style="color: #F5A623">POST</span> Schedule post.

**Endpoint:** `/schedule/{{id}}`

**Params:**

+ `account`: The ID of the account that will post.
+ `seconds_until_post`: The seconds to wait before posting the post.
+ `post`: The ID of the post to schedule.

**Data:**

+ `schedule`: The newly created schedule.

# Account

## <span style="color: #3EB63E">GET</span> Account by ID.

**Endpoint:** `/schedule/account/{{id}}`

**Params:**

+ `show_only_scheduled`: If set, shows only the schedules with a date higher than the current one.

**Data:**

+ `schedule`: The account's schedule.

---

## <span style="color: #3EB63E">GET</span> List Accounts.

**Endpoint:** `/account/{{id}}`

**Data:**

+ `schedule`: The matched schedule.

---

## <span style="color: #F5A623">POST</span> Add Account.

**Endpoint:** `/account/{{id}}`

**Params:**

+ `account`: The ID of the account that will post.
+ `seconds_until_post`: The seconds to wait before posting the post.
+ `post`: The ID of the post to schedule.

**Data:**

+ `schedule`: The newly created schedule.

---

## <span style="color: #4A90E2">PUT</span> Update username.

**Endpoint:** `/account`

**Params:**

+ `id`: The ID of the account.
+ `username`: The seconds to wait before posting the post.

---

## <span style="color: #ED4B48">DEL</span> Delete Account.

**Endpoint:** `/account/{{id}}`
