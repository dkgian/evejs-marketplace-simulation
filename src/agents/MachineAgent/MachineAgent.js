// A machine agent represents
// - the capabilities of the machine and
// - the execution of certain production tasks

// This is a template for extending the base eve Agent prototype
const _ = require('lodash')
// const eve = require('../../index')
const messageType = require('../../constants/message_type')
const taskStatus = require('../../constants/task_status')
const {
  AVAILABLE, PROCESSING, OFFLINE, WEAR_LEVEL_MAX,
} = require('../../constants/machine_status')

function MachineAgent(id, props) {
  /* eslint-disable no-undef */
  eve.Agent.call(this, id)

  this.props = props

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll())
  this.updateWebUI()
  this.checkMachineHealth()
}

function checkMachineHealth() {
  setInterval(() => {
    if (this.props.status === AVAILABLE && this.props.tool.wearOffLevel >= WEAR_LEVEL_MAX) {
      this.props.status = OFFLINE
      setTimeout(() => {
        this.props.status = AVAILABLE
        this.props.tool.wearOffLevel = 0
        this.props.tool.toolingTimes += 1
      }, 5000)
    }
  }, 1000)
}

function placeABid(task) {
  const {
    status,
    geometries,
    tool: {
      hardness,
      surfaceQuality,
    },
  } = this.props

  const isMachineOffline = status === OFFLINE
  const canDoGeometry = geometries.includes(task.geometry)
  const canDoHardness = hardness >= task.materialProperties.hardness
  const canDoSurfaceQuality = surfaceQuality >= task.requiredSurfaceQuality

  const canDo = !isMachineOffline && canDoGeometry && canDoHardness && canDoSurfaceQuality

  // #workpieces * c_power, c_power = 1
  const offerPrice = _.random(1, 10)

  const price = canDo ? offerPrice : null
  const timeToFinish = canDo ? _.random(1, 5) : null
  const wearOffLevel = canDo ? _.random(1, 3) : null

  const bidOffer = {
    ...task,
    type: messageType.BID_OFFERING,
    machine: this.id,
    price,
    timeToFinish,
    wearOffLevel,
  }

  setTimeout(() => {
    this.send('market', bidOffer).done()
  }, 2000)
}


function processTask(task) {
  this.props.status = PROCESSING
  this.props.tool.wearOffLevel += task.wearOffLevel

  const doneTask = {
    ...task,
    type: messageType.TASK_DONE,
    status: taskStatus.DONE,
  }

  setTimeout(() => {
    this.props.status = AVAILABLE
    this.send('market', doneTask).done()
    return null
  }, 2000)
}

function runToolingProcess() {
  return OFFLINE
}

function updateWebUI() {
  function getClassByStatus(status) {
    switch (status) {
      case AVAILABLE:
        return 'bg-available'
      case PROCESSING:
        return 'bg-processing'
      default:
        return 'bg-offline'
    }
  }

  setInterval(() => {
    const StatusElm = document.getElementById(`${this.id}status`)
    const WearOffLevelElm = document.getElementById(`${this.id}wearOffLevel`)
    const BalanceElm = document.getElementById(`${this.id}balance`)
    const ToolingTimesElm = document.getElementById(`${this.id}toolingTimes`)

    const InfoCard = document.getElementById(`${this.id}-card`)

    StatusElm.innerHTML = `Status: ${this.props.status}`
    WearOffLevelElm.innerHTML = `Tool wear level: <strong>${this.props.tool.wearOffLevel}</strong> over ${WEAR_LEVEL_MAX}`
    BalanceElm.innerHTML = `Balance: ${this.props.balance}`
    ToolingTimesElm.innerHTML = `Tooling times: ${this.props.tool.toolingTimes}`

    const cardClass = getClassByStatus(this.props.status)
    InfoCard.classList.remove('bg-available', 'bg-processing', 'bg-offline')
    InfoCard.classList.add(cardClass)
  }, 1000)
}

function receiveMessage(from, message) {
  // ... handle incoming messages
  switch (message.type) {
    case messageType.BID_ASKING:
      this.placeABid(message)
      break

    case messageType.TASK_ASSIGNING:
      console.log(`${this.id} get the task `, message)
      setTimeout(() => {
        this.processTask(message)
      }, 3000)

      break

    case messageType.TASK_REWARD:
      this.props = {
        ...this.props,
        balance: this.props.balance + message.price,
      }

      break
    default:
      console.log(message)
  }
}

MachineAgent.prototype = Object.create(eve.Agent.prototype)
MachineAgent.prototype.constructor = MachineAgent

MachineAgent.prototype.receive = receiveMessage
MachineAgent.prototype.placeABid = placeABid
MachineAgent.prototype.processTask = processTask
MachineAgent.prototype.runToolingProcess = runToolingProcess
MachineAgent.prototype.updateWebUI = updateWebUI
MachineAgent.prototype.checkMachineHealth = checkMachineHealth

module.exports = MachineAgent
