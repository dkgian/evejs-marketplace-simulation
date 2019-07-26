// The market place is simulated by an agent that
// - asks for bids for certain production tasks
// - selects best bids
// - transfers production tasks to machine agents
// - transfers production revenues once machines finished tasks successfully

// This is a template for extending the base eve Agent prototype
// const eve = require('../../index')

let bidOfferList = []

/* eslint-disable no-undef */
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

function selectBestOffer() {
  return function () {
    const enoughBidOffer = (bidOfferList.length === 3)
    if (enoughBidOffer) {
      return findBestOffer(bidOfferList)
    }
    return undefined
  }
}

function updateLogTable(bidResult) {
  const table = document.getElementById('marketTableLog')
  const row = table.insertRow(0)
  const cell1 = row.insertCell(0)
  const cell2 = row.insertCell(1)
  const cell3 = row.insertCell(2)
  cell1.innerHTML = bidResult.task.name
  cell2.innerHTML = bidResult.price
  cell3.innerHTML = bidResult.machine
}

function assignTask() {
  return function (bestOffer) {
    if (bestOffer === undefined) {
      return undefined
    }

    const bidResult = {
      ...bestOffer,
      type: 'task_assigning',
    }
    this.props.transactionLog.push(bidResult)

    updateLogTable(bidResult)

    return this.send(bestOffer.machine, bidResult)
      .done()
  }
}

function receiveMessage() {
  return function (from, message) {
    // ... handle incoming messages
    console.log(`${from} -> ${this.id} : `, message)
    switch (message.type) {
      case 'bid_offering':
        bidOfferList.push(message)
        // eslint-disable-next-line no-case-declarations
        const bestOffer = this.selectBestOffer()
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
}

function openBidSession() {
  return function (machines, task) {
    machines.map(machine => this.send(machine, task)
      .done())
  }
}


function transferRevenue() {
  return function (machine, amount) {
    // transfers production revenues once machines finished tasks successfully
    this.send(machine, amount)
  }
}


MarketAgent.prototype = Object.create(eve.Agent.prototype)
MarketAgent.prototype.constructor = MarketAgent

MarketAgent.prototype.assignTask = assignTask()
MarketAgent.prototype.openBidSession = openBidSession()
MarketAgent.prototype.transferRevenue = transferRevenue()
MarketAgent.prototype.receive = receiveMessage()
MarketAgent.prototype.selectBestOffer = selectBestOffer()

// module.exports = MarketAgent
