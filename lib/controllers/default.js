var setupWebsocket = require('../helpers/setup-websocket')
var request = require('request')
module.exports = function (req, socket, body, params) {
  setupWebsocket(req, socket, body, function (message, driver) {
    params.query = params.query || {}
    var runTimeObj = {}
    if (params.runfor) {
      // handle runfor
      runTimeObj.timerRunning = true

      if (params.delay < 5000 && (params.query.override !== process.env.OVERRIDE)) {
        params.delay = 5000
      }
      if (params.runfor > 350000 && (params.query.override !== process.env.OVERRIDE)) {
        params.runfor = 350000
      }
      runTimeObj.timeoutObj = setTimeout(function () {
        timerRunning = false
      }, params.runfor)
      function runDelay () {
        if (runTimeObj.timerRunning) {
          runTimeObj.timoutObj = setTimeout(function () {
            sendResponse(req, socket, body, params, message, driver)
            runDelay()
          }, params.delay)
        }
      }
      runDelay()
    } else if (params.repeat) {
      params.delay = params.delay || 0
      if (params.delay < 5000 && (params.query.override !== process.env.OVERRIDE)) {
        params.delay = 5000
      }
      if (params.repeat > 50 && (params.query.override !== process.env.OVERRIDE)) {
        params.repeat = 50
      }
      function runRepeat (i) {
        if (i) {
          runTimeObj.timoutObj = setTimeout(function () {
            sendResponse(req, socket, body, params, message, driver)
            i--
            runRepeat(i)
          }, params.delay)
        }
      }
      runRepeat(params.repeat)
    } else if (params.delay) {
      runTimeObj.timoutObj = setTimeout(function () {
        sendResponse(req, socket, body, params, message, driver)
      }, params.delay)
    } else {
      sendResponse(req, socket, body, params, message, driver)
    }
    driver.on('close', function (event) {
      console.log((new Date()).toString(), '[', req.connection.remoteAddress, ']', 'closed connection')
      runTimeObj.timerRunning = false
      if (runTimeObj.timoutObj) {
        clearTimeout(runTimeObj.timoutObj)
        runTimeObj.timoutObj = false
      }
    })
  })
}

function sendResponse (req, socket, body, params, message, driver) {
  if (params.query.pipe) {
    request.get(params.query.pipe, function (err, response, body) {
      var message
      if (err) {
        message = 'ERROR IN REQUEST: ' + err.toString()
      }
      if (!response) {
        message = 'ERROR IN REQUEST: Unable to reach host'
      }
      message = message || body
      console.log((new Date()).toString(), '[', req.connection.remoteAddress, ']', 'sending pipe:', params.query.pipe)
      driver.messages.write(message)
    })
  } else {
    var response = params.query.response || {
      timestamp: (new Date()).toString(),
      url: 'http://sockb.in' + req.url,
      reqData: message
    }
    responseJSON = params.query.response || JSON.stringify(response, null, ' ')
    console.log((new Date()).toString(), '[', req.connection.remoteAddress, ']', 'sending message:', message)
    driver.messages.write(responseJSON)
  }
}
