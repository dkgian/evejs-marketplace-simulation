// A machine agent represents
// - the capabilities of the machine and
// - the execution of certain production tasks

// This is a template for extending the base eve Agent prototype
// const eve = require('../../index')

function MachineAgent(id, props) {
  /* eslint-disable no-undef */
  eve.Agent.call(this, id)

  this.props = props

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll())
}


function placeABid() {
  return function (message) {
    const canDo = this.props.capabilities.includes(message.task.name)
    const price = canDo ? (Math.random() * 10).toFixed(3) : null
    const delaytime = Math.random() * 5000

    const bid = {
      ...message,
      type: 'bid_offering',
      machine: this.id,
      price,
    }
    // console.log(`${this.id} places`, bid)
    setTimeout(() => {
      this.send('market', bid)
        .done()
    }, delaytime)
  }
}


function processTask() {
  return function (task) {
    console.log(`${this.id} is processing task`, task)
    const doneTask = {
      ...task,
      type: 'task_done',
      status: 'done',
    }
    setTimeout(() => {
      this.send('market', doneTask)
        .done()
      return null
    }, 5000)
  }
}

function receiveMessage() {
  return function (from, message) {
    // ... handle incoming messages
    switch (message.type) {
      case 'bid_asking':
        this.placeABid(message)
        break
      case 'task_assigning':
        console.log('Selecting the best offer')
        console.log(`${this.id} get the task `, message)
        setTimeout(() => {
          this.processTask(message)
        }, 3000)

        break
      case 'reward':
        this.props = {
          ...this.props,
          balance: this.props.balance + message.amount,
        }
        console.log(`${this.id}: `, this.props)
        console.log('FINISH SESSION!')
        break
      default:
        console.log(message)
    }
  }
}

const calculatePrice = () => {
  console.log('calculate price')
  return 1
}

MachineAgent.prototype = Object.create(eve.Agent.prototype)
MachineAgent.prototype.constructor = MachineAgent

MachineAgent.prototype.receive = receiveMessage()
MachineAgent.prototype.placeABid = placeABid()
MachineAgent.prototype.processTask = processTask()
MachineAgent.prototype.calculatePrice = calculatePrice()


// module.exports = MachineAgent
