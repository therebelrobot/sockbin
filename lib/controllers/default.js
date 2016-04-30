var setupWebsocket = require('../helpers/setup-websocket')
var request = require('request')
module.exports = function (req, socket, body, params) {
  setupWebsocket(req, socket, body, function (message, driver) {
    params.query = params.query || {}
    if (params.runfor) {
      // handle runfor
      var timerRunning = true
      var timeout = params.runfor

      if(params.delay < 5000 &&(params.query.override !== process.env.OVERRIDE)){
        params.delay = 5000
      }
      if(params.runfor > 350000 &&(params.query.override !== process.env.OVERRIDE)){
        params.runfor = 350000
      }
      setTimeout(function () {
        timerRunning = false
      }, timeout)
      function runDelay () {
        if (timerRunning) {
          setTimeout(function () {
            sendResponse(req, socket, body, params, message, driver)
            runDelay()
          }, params.delay)
        }
      }
      runDelay()
    } else if (params.repeat) {
      params.delay = params.delay || 0
      if(params.delay < 5000 &&(params.query.override !== process.env.OVERRIDE)){
        params.delay = 5000
      }
      if(params.repeat > 50 &&(params.query.override !== process.env.OVERRIDE)){
        params.repeat = 50
      }
      function runRepeat (i) {
        if (i) {
          setTimeout(function () {
            sendResponse(req, socket, body, params, message, driver)
            i--
            runRepeat(i)
          }, params.delay)
        }
      }
      runRepeat(params.repeat)
    } else if (params.delay) {
      setTimeout(function () {
        sendResponse(req, socket, body, params, message, driver)
      }, params.delay)
    } else {
      sendResponse(req, socket, body, params, message, driver)
    }
  })
}

function sendResponse (req, socket, body, params, message, driver) {
  if(params.query.pipe){
    request.get(params.query.pipe, function(err, response, body){
      var response
      if(err){
        response = 'ERROR IN REQUEST: ' + err.toString()
      }
      if(!response){
        response = 'ERROR IN REQUEST: Unable to reach host'
      }
      response = response || body
      driver.messages.write(response)
    })
  } else {
    var response = params.query.response || {
      timestamp: (new Date()).toString(),
      url: 'http://sockb.in' + req.url,
      reqData: message
    }
    responseJSON = params.query.response || JSON.stringify(response, null, ' ')
    driver.messages.write(responseJSON)
  }
}
