// The market place is simulated by an agent that
// - asks for bids for certain production tasks
// - selects best bids
// - transfers production tasks to machine agents
// - transfers production revenues once machines finished tasks successfully

// This is a template for extending the base eve Agent prototype
// const eve = require('../../index')
const _ = require('lodash')
const messageType = require('../../constants/message_type')
const {
  RECEIVED,
  LISTENING,
  STRATEGY_PRICE,
  STRATEGY_TIME,
  STRATEGY_FAIR,
} = require('../../constants/marketplace_status')

let bidOfferList = []

/* eslint-disable no-undef */
function MarketAgent(id, props) {
  eve.Agent.call(this, id)
  this.props = props

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll())

  // ... other initialization
}

function findBestOffer(offerArray) {
  const { strategy } = this.props
  let bestOffer

  const bidList = offerArray.filter(element => element.price !== null)

  switch (strategy) {
    case STRATEGY_PRICE:
      bestOffer = _.minBy(bidList, bid => bid.price)
      break
    case STRATEGY_TIME:
      bestOffer = _.minBy(bidList, bid => bid.timeToFinish)
      break
    case STRATEGY_FAIR:
      bestOffer = _.minBy(bidList, bid => bid.taskQueueSize)
      break
    default:
      console.log('Unknown strategy')
      break
  }

  bidOfferList = []
  return bestOffer
}

function collectAndSelectProposal() {
  const enoughBidOffer = (bidOfferList.length === 3)
  if (enoughBidOffer) {
    const bestBid = findBestOffer.bind(this)(bidOfferList)
    return bestBid
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

  return this.send(bestOffer.machine, bidResult).done()
}

function receiveMessage(from, message) {
  // ... handle incoming messages
  console.log(`${from} -> ${this.id} : `, message)
  switch (message.type) {
    case messageType.BID_ASKING:
      // set market agent props (status)
      this.props.status = RECEIVED

      setTimeout(() => {
        this.broadcastMessage(['machine1', 'machine2', 'machine3'], message)
      }, 1000)
      break

    case messageType.BID_OFFERING:
      bidOfferList.push(message)
      // eslint-disable-next-line no-case-declarations
      const bestOffer = this.collectAndSelectProposal.bind(this)()
      // done asking, back to listening status
      this.props.status = LISTENING

      this.assignTask(bestOffer)
      break

    case messageType.TASK_DONE:
      console.log('pay for ', from)
      const {
        transactionLog,
        machines: {
          toolingTimes,
        },
        toolingTimesData,
      } = this.props

      transactionLog.push(message)

      // const dataRow = [transactionLog.length, toolingTimes]
      toolingTimesData.push(toolingTimes)

      // eslint-disable-next-line no-case-declarations
      const payForTask = {
        ...message,
        type: messageType.TASK_REWARD,
      }

      this.transferRevenue(payForTask)
      break

    case messageType.MACHINE_TOOLING:
      this.props.machines.toolingTimes += 1
      break
    default:
      break
  }
}

function broadcastMessage(machines, task) {
  machines.map(machine => this.send(machine, task).done())
}

function transferRevenue(rewardData) {
  this.send(rewardData.machine, rewardData)
}


MarketAgent.prototype = Object.create(eve.Agent.prototype)
MarketAgent.prototype.constructor = MarketAgent

MarketAgent.prototype.assignTask = assignTask
MarketAgent.prototype.broadcastMessage = broadcastMessage
MarketAgent.prototype.transferRevenue = transferRevenue
MarketAgent.prototype.receive = receiveMessage
MarketAgent.prototype.collectAndSelectProposal = collectAndSelectProposal

module.exports = MarketAgent
