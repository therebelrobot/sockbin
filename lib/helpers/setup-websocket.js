
var websocket = require('websocket-driver')

module.exports = function (req, socket, body, cb){
  if (!websocket.isWebSocket(req)) return
  var driver = websocket.http(req)
  driver.io.write(body)
  socket.pipe(driver.io).pipe(socket)
  driver.messages.on('data', function(message){
    cb(message, driver)
  })
  driver.start()
}
