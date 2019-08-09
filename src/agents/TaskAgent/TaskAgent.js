
// This is a template for extending the base eve Agent prototype
// const eve = require('../../index')

/* eslint-disable no-undef */
function TaskAgent(id, props) {
  eve.Agent.call(this, id)
  this.props = props

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll())

  // ... other initialization
}

function receiveMessage() {
  return function (from, message) {
    // ... handle incoming messages
    console.log(`${from} -> ${this.id} : `, message)
  }
}

function sendTask() {
  return function (to, task) {
    this.send(to, task)
      .done()
  }
}

TaskAgent.prototype = Object.create(eve.Agent.prototype)
TaskAgent.prototype.constructor = TaskAgent

TaskAgent.prototype.sendTask = sendTask()
TaskAgent.prototype.receive = receiveMessage()

module.exports = TaskAgent
