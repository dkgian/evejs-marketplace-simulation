// The market place is simulated by an agent that
// - asks for bids for certain production tasks
// - selects best bids
// - transfers production tasks to machine agents
// - transfers production revenues once machines finished tasks successfully

// This is a template for extending the base eve Agent prototype
// const eve = require('../../index')
const messageType = require('../../constants/message_type')
const { RECEIVED, LISTENING } = require('../../constants/marketplace_status')

let bidOfferList = []

/* eslint-disable no-undef */
function MarketAgent(id, props) {
  eve.Agent.call(this, id)
  this.props = props

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll())

  // ... other initialization
  this.updateWebUI()
}


function updateWebUI() {
  setInterval(() => {
    const BalanceElm = document.getElementById('marketBalance')
    const ToolingTimesElm = document.getElementById('marketToolingTimes')

    BalanceElm.innerHTML = `Balance: ${this.props.balance}`
    ToolingTimesElm.innerHTML = `Tooling times: ${this.props.toolingTimes}`
  }, 1000)
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
  const enoughBidOffer = (bidOfferList.length === 3)
  if (enoughBidOffer) {
    return findBestOffer(bidOfferList)
  }
  return undefined
}

function assignTask(bestOffer) {
  if (bestOffer === undefined) {
    return undefined
  }

  const bidResult = {
    ...bestOffer,
    type: messageType.TASK_ASSIGNING,
  }
  this.props.transactionLog.push(bidResult)

  return this.send(bestOffer.machine, bidResult).done()
}

function receiveMessage(from, message) {
  // ... handle incoming messages
  console.log(`${from} -> ${this.id} : `, message)
  switch (message.type) {
    case messageType.BID_ASKING:
      // set market agent props (status, strategy)
      this.props.status = RECEIVED
      this.props.strategy = message.strategy

      setTimeout(() => {
        this.broadcastMessage(['machine1', 'machine2', 'machine3'], message)
      }, 2000)
      break

    case messageType.BID_OFFERING:
      bidOfferList.push(message)
      // eslint-disable-next-line no-case-declarations
      const bestOffer = this.selectBestOffer()
      // done asking, back to undefined
      this.props.status = LISTENING

      this.assignTask(bestOffer)
      break

    case messageType.TASK_DONE:
      console.log('pay for ', from)
      // eslint-disable-next-line no-case-declarations
      const payForTask = {
        ...message,
        type: messageType.TASK_REWARD,
      }

      this.transferRevenue(payForTask)
      break
    default:
      break
  }
}

function broadcastMessage(machines, task) {
  machines.map(machine => this.send(machine, task).done())
}

function transferRevenue(payForTask) {
  const { machine } = payForTask

  this.send(machine, payForTask)
}


MarketAgent.prototype = Object.create(eve.Agent.prototype)
MarketAgent.prototype.constructor = MarketAgent

MarketAgent.prototype.assignTask = assignTask
MarketAgent.prototype.broadcastMessage = broadcastMessage
MarketAgent.prototype.transferRevenue = transferRevenue
MarketAgent.prototype.receive = receiveMessage
MarketAgent.prototype.selectBestOffer = selectBestOffer
MarketAgent.prototype.updateWebUI = updateWebUI

module.exports = MarketAgent
