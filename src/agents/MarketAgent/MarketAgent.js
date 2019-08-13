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
let marketLogText = ''
function marketLogger(text) {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }
  const now = new Date().toLocaleDateString('en-GB', options)

  const newLogText = `${now}: ${text}<br>`

  marketLogText = marketLogText.concat(newLogText)
  document.getElementById('marketLog').innerHTML = marketLogText
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
    setTimeout(() => {
      marketLogger(`${bestOffer.machine} is selected for task "${bestOffer.task.name}"`)
    }, 2000)

    return this.send(bestOffer.machine, bidResult)
      .done()
  }
}

function receiveMessage() {
  return function (from, message) {
    // ... handle incoming messages
    console.log(`${from} -> ${this.id} : `, message)
    switch (message.type) {
      case 'bid_asking':
        // eslint-disable-next-line no-case-declarations
        const task = message
        // change color when got new task msg
        this.props.status = 'received'
        marketLogger(`${from}: sent a new task "${task.name}"`)
        marketLogger(`${this.id} is preparing for asking bid from machines...`)
        setTimeout(() => {
          this.openBidSession(['machine1', 'machine2', 'machine3'], message)
        }, 5000)
        break
      case 'bid_offering':
        marketLogger(`${from}: place ${message.price}$ for task "${message.task.name}"`)
        bidOfferList.push(message)
        // eslint-disable-next-line no-case-declarations
        const bestOffer = this.selectBestOffer()
        // done asking, back to undefined
        this.props.status = 'listening'
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
        marketLogger(`${from} has finished task "${message.task.name}" !`)
        this.transferRevenue(message.machine, payForTask)
        marketLogger(`===Transaction for task "${message.task.name}" is done!===`)
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
    const { price, task: { name } } = amount
    marketLogger(`Paid ${price}$ to ${machine} for task ${name}.`)
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

module.exports = MarketAgent
