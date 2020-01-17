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

function placeABid() {
  return function (task) {
    const machine = this.props

    const canDoGeometry = machine.geometries.includes(task.geometry)
    const canDoHardness = machine.currentTool.harness >= task.materialProperties.hardness
    const canDoSurfaceQuality = machine.currentTool.surfaceQuality >= task.requiredSurfaceQuality

    const canDo = canDoGeometry && canDoHardness && canDoSurfaceQuality

    // #workpieces * c_power, c_power = 1
    // const cPower = 1
    // const powerPrice = task.amountOfWorkpieces * cPower

    // const cLubricant = 1
    // const lubricantPrice = task.amountOfWorkpieces * cLubricant

    const randomConstant = (Math.random() * 10).toFixed(3)

    const offerPrice = Number(randomConstant)

    const price = canDo ? offerPrice : null
    const delaytime = Math.random() * 1000

    const bid = {
      ...task,
      type: messageType.BID_OFFERING,
      machine: this.id,
      price,
    }

    setTimeout(() => {
      this.send('market', bid)
        .done()
    }, delaytime)
  }
}


function processTask() {
  return function (task) {
    this.props.status = 'busy'
    const doneTask = {
      ...task,
      type: messageType.TASK_DONE,
      status: taskStatus.DONE,
    }

    document.getElementById(`${this.id}status`).innerHTML = `Status: ${this.props.status}`

    setTimeout(() => {
      this.props.status = 'active'

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
