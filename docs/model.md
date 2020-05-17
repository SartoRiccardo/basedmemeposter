## Account

+ **id:** `int`
+ **username:** `string`
+ **password:** `string` The password is encoded with an RSA Public Key
+ **startTime:** `time`
+ **endTime:** `time`

## Captions

+ **id:** `int`
+ **text:** `string`

## Ignored

+ **user:** `User(id)`
+ **level:** `string`
+ **ignored:** `int`

## Logs

+ **id:** `int`
+ **date:** `datetime`
+ **level:** `string`
+ **account:** `Account(id)`
+ **message:** `text`

## Posts

+ **id:** `int`
+ **platform:** `string`
+ **originalId:** `string`
+ **dateAdded:** `date`
+ **originalLink:** `string` The direct link to the image/video
+ **thumbnail:** `string` A link to an image representing the post

## Schedule

+ **id:** `int`
+ **date:** `datetime`
+ **account:** `Account(id)`
+ **post:** `Post(id)`