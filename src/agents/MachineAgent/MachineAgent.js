// A machine agent represents
// - the capabilities of the machine and
// - the execution of certain production tasks

// This is a template for extending the base eve Agent prototype
const _ = require('lodash')
// const eve = require('../../index')
const messageType = require('../../constants/message_type')
const taskStatus = require('../../constants/task_status')
const { AVAILABLE, PROCESSING, OFFLINE } = require('../../constants/machine_status')

function MachineAgent(id, props) {
  /* eslint-disable no-undef */
  eve.Agent.call(this, id)

  this.props = props

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll())
}

function placeABid() {
  return function (task) {
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
    // const cPower = 1
    // const powerPrice = task.amountOfWorkpieces * cPower

    // const cLubricant = 1
    // const lubricantPrice = task.amountOfWorkpieces * cLubricant

    const offerPrice = _.random(1, 10)

    const price = canDo ? offerPrice : null
    const wearOffLevel = canDo ? _.random(1, 3) : null

    const bidOffer = {
      ...task,
      type: messageType.BID_OFFERING,
      machine: this.id,
      price,
      wearOffLevel,
    }

    setTimeout(() => {
      this.send('market', bidOffer).done()
    }, 2000)
  }
}


function processTask() {
  return function (task) {
    this.props.status = PROCESSING
    this.props.tool.wearOffLevel += task.wearOffLevel

    const doneTask = {
      ...task,
      type: messageType.TASK_DONE,
      status: taskStatus.DONE,
    }

    document.getElementById(`${this.id}status`).innerHTML = `Status: ${this.props.status}`

    document.getElementById(`${this.id}wearOffLevel`).innerHTML = `Tool wear level: ${this.props.tool.wearOffLevel}`

    setTimeout(() => {
      this.props.status = AVAILABLE
      this.send('market', doneTask)
        .done()
      return null
    }, 2000)
  }
}

function receiveMessage() {
  return function (from, message) {
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

        document.getElementById(`${this.id}status`).innerHTML = `Status: ${this.props.status}`
        document.getElementById(`${this.id}balance`).innerHTML = `Balance: ${this.props.balance}`

        break
      default:
        console.log(message)
    }
  }
}

MachineAgent.prototype = Object.create(eve.Agent.prototype)
MachineAgent.prototype.constructor = MachineAgent

MachineAgent.prototype.receive = receiveMessage()
MachineAgent.prototype.placeABid = placeABid()
MachineAgent.prototype.processTask = processTask()

module.exports = MachineAgent
