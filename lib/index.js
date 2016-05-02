// set up server

// websocket-driver-node https://github.com/faye/websocket-driver-node
// http://codepen.io/therebelrobot/pen/mPGQQz

var http = require('http')
var url = require('url')
var qp = require('query-parse')
var express = require('express')
var websocket = require('websocket-driver')
var path = require('path')

var app = express()

var server = http.createServer(app)

var requireDir = require('require-dir')
var controllers = requireDir('./controllers', {recurse: true})

app.set('views', path.resolve(__dirname, '../client'))
app.engine('html', require('ejs').renderFile);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req,res,next){
  res.render('index.html')
})

server.on('upgrade', function (req, socket, body) {

  // set up routes
  var route = req.url
  var params = {}
  var query
  console.log('opened connection with', req.connection.remoteAddress)

  if(route.indexOf('?')>-1){
    route = route.split('?')
    query = route[1]
    route = route[0]
    params.query = qp.toObject(query)
  }
  route = route.split('/')
  route.shift()
  if(!route[0]){
    route.unshift('default')
  }

  var delayindex = route.indexOf('delay')
  var repeatindex = route.indexOf('repeat')
  var runforindex = route.indexOf('runfor')

  if(delayindex>-1){
    params.delay = parseInt(route[delayindex+1])
  }
  if(repeatindex>-1){
    params.repeat = parseInt(route[repeatindex+1])
  }
  if(runforindex>-1){
    params.runfor = route[runforindex+1]
    var lastChar = params.runfor[params.runfor.length - 1]
    if (isLetter(lastChar)) {
      var multiplier = 1
      switch (lastChar) {
        case 's':
          multiplier = 1000
          break
        case 'm':
          multiplier = 60 * 1000
          break
        case 'h':
          multiplier = 60 * 60 * 1000
          break
      }
      params.runfor = params.runfor.substring(0, params.runfor.length - 1)
      params.runfor = parseInt(params.runfor * multiplier, 10)
    } else {
      params.runfor = parseInt(params.runfor, 10)
    }
  }
  controllers.default(req, socket, body, params)
})

var port = process.env.PORT || 4080

server.listen(port, function(){
  console.log('Sockbin listening on port', port)
})


function isLetter (str) {
  return str.length === 1 && str.match(/[a-z]/i)
}
