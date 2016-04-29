![sockbin](/sockbin-title-padding.png)

:zap: Websocket Requests and Response service. Built in Node.js :cake:

### URL

`ws://sockb.in/`

Feel free to play in the [Sockbin Playground!](http://sockb.in)

### API

#### Basic response

Returns a basic json object echoing back the time of the request and the posted data

*Endpoint:* `/`

*Response:*
```js
{
 "timestamp": "Thu Apr 28 2016 22:25:19 GMT+0000 (UTC)",
 "url": "http://sockb.in/",
 "reqData": "Hello Sockbin!"
}
```

#### Custom Response

Returns the value of `response=` in the URL, after decoding.

*Endpoint:* `/?response=%7Bfoo%3A%20bar%7D`

*Response:*
```js
{foo: bar}
```

#### URL Piping

Returns the results of a `GET` request to the provided URL in the `pipe=` parameter.

*Endpoint:* `/?pipe=http%3A%2F%2Fhttpbin.org%2Fget`

*Response:*
```js
{
  "args": {}, 
  "headers": {
    "Host": "httpbin.org"
  }, 
  "origin": "54.90.123.185", 
  "url": "http://httpbin.org/get"
}
```

#### Delay

Returns after a specified time (in ms)

*Endpoint:* `/delay/1000`

*Response:*
```js
{
 "timestamp": "Thu Apr 28 2016 22:25:19 GMT+0000 (UTC)",
 "url": "http://sockb.in/",
 "reqData": "Hello Sockbin!"
}
// returns after 1 second
```

#### Repeat

Returns a basic json object the specified number of times

*Endpoint:* `/repeat/5`

*Response:*
```js
{
 "timestamp": "Thu Apr 28 2016 22:25:19 GMT+0000 (UTC)",
 "url": "http://sockb.in/",
 "reqData": "Hello Sockbin!"
}
// repeated 5 times
```

#### Combining

You can combine these endpoints to produce more robust results

*Endpoint:* `/delay/5000/repeat/5`

*Response:*
```js
{
 "timestamp": "Thu Apr 28 2016 22:25:19 GMT+0000 (UTC)",
 "url": "http://sockb.in/",
 "reqData": "Hello Sockbin!"
}
// repeated 5 times every 5 seconds
```

#### Run For

You can use the delay endpoint with a special endpoint, `runfor` to return every *x* seconds for the specified time.

*Endpoint:* `/runfor/60000/delay/5000`

*Response:*
```js
{
 "timestamp": "Thu Apr 28 2016 22:25:19 GMT+0000 (UTC)",
 "url": "http://sockb.in/",
 "reqData": "Hello Sockbin!"
}
// repeated every 5 seconds for 1 minute
```

### Hosted restrictions

[sockb.in](http://sockb.in) is hosted on a free dyno on Heroku. As such, usage is restricted. The restricitions are as follows:
- When repeating with a delay, delay must be over 5 seconds, and repeat must be under 50
- when using `runfor`, delay must be over 5 seconds, and `runfor` cannot be over 5 minutes.

### Local Installation

You can install sockbin by cloning this repo locally:

```
git clone https://github.com/therebelrobot/sockbin.git
cd sockbin
npm install
npm start
```

Once there, if you set an environment variable of `OVERRIDE=token`, and include that in your url request as `&override=token`, it will bypass the hosted restrictions.

### Contributing

Please feel free! [Open a Github Issue](https://github.com/therebelrobot/sockbin) for any issues you find, and feel free to [Fork this repo](https://github.com/therebelrobot/sockbin#fork-destination-box) to work on your own changes!

If you are running this in development mode, use `npm run develop` instead of `npm start` to use `nodemon` automagically.

### License

[ISC](https://tldrlegal.com/license/-isc-license)
