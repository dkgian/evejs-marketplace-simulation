// The market place is simulated by an agent that
// - asks for bids for certain production tasks
// - selects best bids
// - transfers production tasks to machine agents
// - transfers production revenues once machines finished tasks successfully

// This is a template for extending the base eve Agent prototype
// const eve = require('../../index')

function MarketAgent(id) {
  eve.Agent.call(this, id)
  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll())

  // ... other initialization
  this.extend('request')
}

MarketAgent.prototype = Object.create(eve.Agent.prototype)
MarketAgent.prototype.constructor = MarketAgent

MarketAgent.prototype.receive = function (from, message) {
  // ... handle incoming messages
}

MarketAgent.prototype.openBidSession = function (machines, task) {
  machines.map(machine => {
    this.send(machine, task)
  })
}

MarketAgent.prototype.selectBestBid = function (BidList) {
  // select the best bid, default is minimum $
}

MarketAgent.prototype.transferTask = function (BidList) {
  // transfers production tasks to machine agents
}

MarketAgent.prototype.transferRevenue = function (machine, amount) {
  // transfers production revenues once machines finished tasks successfully
  this.send(machine, amount)
}

// module.exports = MarketAgent
