// A machine agent represents
// - the capabilities of the machine and
// - the execution of certain production tasks

// This is a template for extending the base eve Agent prototype
// const eve = require('../../index')

function TaskAgent(id) {
  /* eslint-disable no-undef */
  eve.Agent.call(this, id)

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll())
  // ... other initialization
}

TaskAgent.prototype = Object.create(eve.Agent.prototype)
TaskAgent.prototype.constructor = TaskAgent

TaskAgent.prototype.receive = function (from, message) {
  // ... handle incoming messages
  console.log(from, message)
}

TaskAgent.prototype.openBidSession = function (machines, task) {
  machines.map(machine => this.send(machine, task).done())
}

// module.exports = TaskAgent
