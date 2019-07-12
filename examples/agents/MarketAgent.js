// The market place is simulated by an agent that
// - asks for bids for certain production tasks
// - selects best bids
// - transfers production tasks to machine agents
// - transfers production revenues once machines finished tasks successfully

// This is a template for extending the base eve Agent prototype
// const eve = require('../../index')

let bidOfferList = []

function MarketAgent(id, props) {
  eve.Agent.call(this, id)
  this.props = props

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll())

  // ... other initialization
}

function findBestOffer(arr) {
  const bidList = arr.filter(element => element.price !== null)
  let bestOffer = bidList[0]
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < bidList.length; i++) {
    const nextOffer = bidList[i]
    const nextOfferPrice = nextOffer.price
    bestOffer = (nextOfferPrice !== null && nextOfferPrice < bestOffer.price)
      ? nextOffer : bestOffer
  }
  bidOfferList = []
  return bestOffer
}

MarketAgent.prototype = Object.create(eve.Agent.prototype)
MarketAgent.prototype.constructor = MarketAgent

MarketAgent.prototype.selectBestOffer = function () {
  const enoughBidOffer = (bidOfferList.length === 3)
  if (enoughBidOffer) {
    return findBestOffer(bidOfferList)
  }
}

MarketAgent.prototype.assignTask = function (bestOffer) {
  if (bestOffer === undefined) {
    return null
  }

  const bidResult = {
    ...bestOffer,
    type: 'task_assigning',
  }
  return this.send(bestOffer.machine, bidResult).done()
}

MarketAgent.prototype.receive = async function (from, message) {
  // ... handle incoming messages
  console.log(`${from} -> ${this.id} : `, message)
  switch (message.type) {
    case 'bid_offering':
      bidOfferList.push(message)
      // eslint-disable-next-line no-case-declarations
      const bestOffer = await this.selectBestOffer()
      this.assignTask(bestOffer)
      break
    case 'task_done':
      console.log('pay for ', from)
      // eslint-disable-next-line no-case-declarations
      const payForTask = {
        ...message,
        amount: Number(message.price),
        type: 'reward',
      }
      this.transferRevenue(message.machine, payForTask)
      break
    default:
      break
  }
}

MarketAgent.prototype.openBidSession = function (machines, task) {
  machines.map(machine => this.send(machine, task).done())
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
