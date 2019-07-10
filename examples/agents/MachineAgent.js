// A machine agent represents
// - the capabilities of the machine and
// - the execution of certain production tasks

// This is a template for extending the base eve Agent prototype
const eve = require('../../index')

function MachineAgent(id, props) {
  eve.Agent.call(this, id)

  this.props = props

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll())

  // ... other initialization
}

MachineAgent.prototype = Object.create(eve.Agent.prototype)
MachineAgent.prototype.constructor = MachineAgent

MachineAgent.prototype.receive = function (from, message) {
  // ... handle incoming messages
  switch (message.type) {
    case 'bid':
      console.log('bid now...')
      break
    case 'bid_result':
      console.log('bid result')
      break
    case 'reward':
      console.log(`${this.id} balance: `, this.props)
      this.props = this.props + message.amount
      console.log(`${this.id} balance: `, this.props)
      break
    default:
      console.log('idunno')
  }
}

MachineAgent.prototype.executeTask = function(task) {
  // the execution of certain production tasks
}


module.exports = MachineAgent
