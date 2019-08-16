// A machine agent represents
// - the capabilities of the machine and
// - the execution of certain production tasks

// This is a template for extending the base eve Agent prototype
// const eve = require('../../index')
const messageType = require('../../constants/message_type')
const taskStatus = require('../../constants/task_status')

function MachineAgent(id, props) {
  /* eslint-disable no-undef */
  eve.Agent.call(this, id)

  this.props = props

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll())
}

let machine1LogText = ''
let machine2LogText = ''
let machine3LogText = ''

function logger(machine, text) {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }
  const now = new Date().toLocaleDateString('en-GB', options)

  const machineLogID = `${machine}Log`
  const machineLogText = `${now}: ${text}<br>`

  if (machine === 'machine1') {
    machine1LogText = machine1LogText.concat(machineLogText)
    document.getElementById(machineLogID).innerHTML = machine1LogText
  } else if (machine === 'machine2') {
    machine2LogText = machine2LogText.concat(machineLogText)
    document.getElementById(machineLogID).innerHTML = machine2LogText
  } else if (machine === 'machine3') {
    machine3LogText = machine3LogText.concat(machineLogText)
    document.getElementById(machineLogID).innerHTML = machine3LogText
  }
}

function placeABid() {
  return function (task) {
    const machine = this.props

    const canDoGeometry = machine.geometries.includes(task.geometry)
    const canDoHardness = machine.currentTool.harness >= task.materialProperties.hardness
    const canDoSurfaceQuality = machine.currentTool.surfaceQuality >= task.requiredSurfaceQuality

    const canDo = canDoGeometry && canDoHardness && canDoSurfaceQuality

    // #workpieces * c_power, c_power = 1
    const cPower = 1
    const powerPrice = task.amountOfWorkpieces * cPower

    const cLubricant = 1
    const lubricantPrice = task.amountOfWorkpieces * cLubricant

    const randomConstant = (Math.random() * 10).toFixed(3)
    const offerPrice = powerPrice + lubricantPrice + Number(randomConstant)

    const price = canDo ? offerPrice : null
    const delaytime = Math.random() * 5000

    const bid = {
      ...task,
      type: messageType.BID_OFFERING,
      machine: this.id,
      price,
    }

    const placeBidLog = (price === null)
      ? `${this.id} is not able to process this task`
      : `${this.id} offers ${price} for ${task.amountOfWorkpieces} workpieces with geometry "${task.geometry}"`

    logger(this.id, placeBidLog)

    setTimeout(() => {
      this.send('market', bid)
        .done()
    }, delaytime)
  }
}


function processTask() {
  return function (task) {
    const processingLog = `${this.id} is processing ${task.name}`
    logger(this.id, processingLog)

    this.props.status = 'busy'
    const doneTask = {
      ...task,
      type: messageType.TASK_DONE,
      status: taskStatus.DONE,
    }

    document.getElementById(`${this.id}status`).innerHTML = `Status: ${this.props.status}`

    setTimeout(() => {
      this.props.status = 'active'

      const doneLog = `${this.id} is done with task ${task.name} and send back to marketplace.`
      logger(this.id, doneLog)

      this.send('market', doneTask)
        .done()
      return null
    }, 8000)
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
        logger(this.id, `${this.id} get the task ${message.name} ${message.amountOfWorkpieces} geometry ${message.geometry} workpieces.`)

        setTimeout(() => {
          this.processTask(message)
        }, 3000)

        break

      case messageType.TASK_REWARD:
        this.props = {
          ...this.props,
          balance: this.props.balance + message.price,
        }

        // update visual part
        logger(this.id, `${this.id} get reward ${message.price} $ for task ${message.name} ${message.amountOfWorkpieces} geometry ${message.geometry} workpieces`)
        logger(this.id, `Balance is updated: ${this.props.balance} $`)
        logger(this.id, '==== Transaction is done ====')

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
