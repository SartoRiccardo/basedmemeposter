# Accounts

## <span style="color:green">GET</span> /accounts

### Reponses

1. A list of all registered accounts. Not paginated. The request will return with status code **200**.

## <span style="color:green">GET</span> /accounts/{id}

The `id` param must be a valid [`Account`](./model.md) ID.

### Reponses

1. The matching account. Status code **200**.
2. An error saying the account was not found. Status code **404**.

## <span style="color: orange">POST</span> /accounts

### Request

A valid [`Account`](./model.md) JSON object in the request body.

### Responses

1. The newly created account. The request will return with status code **201** and the **Location** header pointing to the newly created resource.
2. A list of validation errors. The request will return with status code **422**

## <span style="color: blue">PUT</span> /accounts/{id}

### Request

The `id` param must be a valid [`Account`](./model.md) ID.

A valid [`Account`](./model.md) JSON object in the request body. The `password` field may be omitted.

### Responses

1. The updated account. Status code **200**.
2. A list of validation errors. Status code **422**.
3. An error saying the account was not found. Status code **404**.

## <span style="color:red">DELETE</span> /accounts/{id}

The `id` param must be a valid [`Account`](./model.md) ID.

### Reponses

1. Empty body, the deletion was successful. Status code **200**.
2. An error saying the account was not found. Status code **404**.

# Captions

## <span style="color:green">GET</span> /captions

### Reponses

1. A paginated list of captions. The request will return with status code **200**.

## <span style="color:green">GET</span> /captions/{id}

The `id` param must be a valid [`Caption`](./model.md) ID.

### Reponses

1. The matching caption. Status code **200**.
2. An error saying the caption was not found. Status code **404**.

## <span style="color: orange">POST</span> /captions

### Request

A valid [`Caption`](./model.md) JSON object in the request body.

### Responses

1. The newly created caption. The request will return with status code **201** and the **Location** header pointing to the newly created resource.
2. A list of validation errors. The request will return with status code **422**

## <span style="color: blue">PUT</span> /captions/{id}

### Request

The `id` param must be a valid [`Caption`](./model.md) ID.

A valid [`Caption`](./model.md) JSON object in the request body.

### Responses

1. The updated caption. Status code **200**.
2. A list of validation errors. Status code **422**.
3. An error saying the caption was not found. Status code **404**.

## <span style="color:red">DELETE</span> /captions/{id}

The `id` param must be a valid [`Caption`](./model.md) ID.

### Reponses

1. Empty body, the deletion was successful. Status code **200**.
2. An error saying the caption was not found. Status code **404**.

# Logs

## <span style="color:green">GET</span> /logs

### Request

+ **accounts:** a list of account IDs to show. If omitted, all accounts will be included
+ **levels:** a list of log levels to show. If omitted, all levels will be included

### Reponses

1. A paginated list of logs. The request will return with status code **200**.

## <span style="color:green">GET</span> /logs/{id}

The `id` param must be a valid [`Log`](./model.md) ID.

### Reponses

1. The matching log. Status code **200**.
2. An error saying the log was not found. Status code **404**.

## <span style="color: orange">POST</span> /logs

### Request

A valid [`Log`](./model.md) JSON object in the request body, except for the date.

### Responses

1. The newly created log. The request will return with status code **201** and the **Location** header pointing to the newly created resource.
2. A list of validation errors. The request will return with status code **422**.

## <span style="color:red">DELETE</span> /logs/{id}

The `id` param must be a valid [`Log`](./model.md) ID.

### Reponses

1. Empty body, the deletion was successful. Status code **200**.
2. An error saying the log was not found. Status code **404**.

# Posts

## <span style="color:green">GET</span> /posts

### Request

+ **after:** A date formatted string. Posts before the date will not be included.
+ **platforms:** A list of platforms to get the posts from. If omitted, all platforms will be included.

### Reponses

1. A paginated list of posts. The request will return with status code **200**.

## <span style="color:green">GET</span> /posts/{id}

The `id` param must be a valid [`Post`](./model.md) ID.

### Reponses

1. The matching post. Status code **200**.
2. An error saying the post was not found. Status code **404**.

## <span style="color:green">GET</span> /posts/{platform}/{originalId}

The `platform` param must be the platform where the post is from (twitter, instagram, ...).
The `originalId` is the ID it had in that platform.

### Reponses

1. The matching post. Status code **200**.
2. An error saying the post was not found. Status code **404**.

## <span style="color: orange">POST</span> /posts

### Request

A valid [`Post`](./model.md) JSON object in the request body.

### Responses

1. The newly created post. The request will return with status code **201** and the **Location** header pointing to the newly created resource.
2. A list of validation errors. The request will return with status code **422**

## <span style="color: blue">PUT</span> /posts/{id}

### Request

The `id` param must be a valid [`Post`](./model.md) ID.

A valid [`Post`](./model.md) JSON object in the request body.

### Responses

1. The updated post. Status code **200**.
2. A list of validation errors. Status code **422**.
3. An error saying the post was not found. Status code **404**.

## <span style="color:red">DELETE</span> /posts/{id}

The `id` param must be a valid [`Post`](./model.md) ID.

### Reponses

1. Empty body, the deletion was successful. Status code **200**.
2. An error saying the post was not found. Status code **404**.

# Schedule

## <span style="color:green">GET</span> /schedule

### Request

+ **account:** An account ID. Only that account's scheduled posts will be shown. If omitted, all schedules will be returned.

### Reponses

1. A list of schedules. Not paginated. The request will return with status code **200**.

## <span style="color:green">GET</span> /schedule/{id}

The `id` param must be a valid [`Schedule`](./model.md) ID.

### Reponses

1. The matching schedule. Status code **200**.
2. An error saying the schedule was not found. Status code **404**.

## <span style="color: orange">POST</span> /schedule

### Request

A valid [`Schedule`](./model.md) JSON object in the request body.

### Responses

1. The newly created schedule. The request will return with status code **201** and the **Location** header pointing to the newly created resource.
2. A list of validation errors. The request will return with status code **422**

## <span style="color: blue">PUT</span> /schedule/{id}

### Request

The `id` param must be a valid [`Schedule`](./model.md) ID.

A valid [`Schedule`](./model.md) JSON object in the request body.

### Responses

1. The updated schedule. Status code **200**.
2. A list of validation errors. Status code **422**.
3. An error saying the schedule was not found. Status code **404**.

## <span style="color:red">DELETE</span> /schedule/{id}

The `id` param must be a valid [`Schedule`](./model.md) ID.

### Reponses

1. Empty body, the deletion was successful. Status code **200**.
2. An error saying the schedule was not found. Status code **404**.

# Sources

## <span style="color:green">GET</span> /sources

### Reponses

1. A list of sources. Not paginated. The request will return with status code **200**.

## <span style="color:green">GET</span> /sources/{id}

The `id` param must be a valid [`Source`](./model.md) ID.

### Reponses

1. The matching source. Status code **200**.
2. An error saying the source was not found. Status code **404**.

## <span style="color: orange">POST</span> /sources

### Request

A valid [`Source`](./model.md) JSON object in the request body.

### Responses

1. The newly created source. The request will return with status code **201** and the **Location** header pointing to the newly created resource.
2. A list of validation errors. The request will return with status code **422**

## <span style="color: blue">PUT</span> /sources/{id}

### Request

The `id` param must be a valid [`Source`](./model.md) ID.

A valid [`Source`](./model.md) JSON object in the request body.

### Responses

1. The updated source. Status code **200**.
2. A list of validation errors. Status code **422**.
3. An error saying the source was not found. Status code **404**.

## <span style="color:red">DELETE</span> /sources/{id}

The `id` param must be a valid [`Source`](./model.md) ID.

### Reponses

1. Empty body, the deletion was successful. Status code **200**.
2. An error saying the source was not found. Status code **404**.
