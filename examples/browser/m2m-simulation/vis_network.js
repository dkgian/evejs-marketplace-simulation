const $ = require('jquery')
const vis = require('vis')
const Task = require('../../agents/TaskAgent/Task')

// EVE AGENTS PART=====================START================================
/* eslint-disable no-undef */
// init with eve config
// Create agent
eve.system.init({
  transports: [
    {
      type: 'ws',
    },
  ],
})


// Create agent
const taskAgent = new TaskAgent('taskAgent')
const market = new MarketAgent('market', {
  transactionLog: [],
  status: 'listening',
})
const machine1 = new MachineAgent('machine1', {
  balance: 10,
  capabilities: [
    'grinding',
    'coating',
  ],
  status: 'active',
})
const machine2 = new MachineAgent('machine2', {
  balance: 10,
  capabilities: [
    'grinding',
    'case-hardening',
  ],
  status: 'active',
})

const machine3 = new MachineAgent('machine3', {
  balance: 10,
  capabilities: [
    'coating',
    'case-hardening',
  ],
  status: 'active',
})

// function to startSession a single match between player1 and player2
function startSession() {
  // const tasks = ['coating', 'grinding', 'case-hardening']
  // const testTask = {
  //   type: 'bid_asking',
  //   task: {
  //     id: 1,
  //     name: tasks[Math.floor(Math.random() * 3)],
  //   },
  // }

  const testTask = new Task({
    geometry: 'A',
    materialProperties: {
      hardness: 5,
    },
    requiredSurfaceQuality: 2,
    amountOfAbrasion: 10,
  })

  console.log('New Task: ', testTask)
  // send task to market
  taskAgent.sendTask('market', testTask)
  // market.openBidSession(['machine1', 'machine2', 'machine3'], testTask)
}

const startSessionBtn = $('#startSessionBtn')
startSessionBtn.click(() => startSession())

// EVE AGENTS PART=====================END=========================


// VIS PART=====================START=========================
// create an array with nodes
/* eslint-disable no-undef */

const nodes = new vis.DataSet([
  {
    id: 0,
    label: 'Market',
    size: 25,
    shape: 'diamond',
    title: 'I am market agent',
  },
  {
    id: 1,
    label: 'Machine 1',
    title: 'Machine 1 is active',
  },
  {
    id: 2,
    label: 'Machine 2',
    title: 'Machine 2 is running',
  },
  {
    id: 3,
    label: 'Machine 3',
  },
])

// create an array with edges
const edges = new vis.DataSet([
  {
    from: 1,
    to: 0,
  },
  {
    from: 2,
    to: 0,
  },
  {
    from: 3,
    to: 0,
  },
])

// create a network
const container = document.getElementById('networkVis')
const changeColorBtn = $('#changeColorBtn')

const data = { nodes, edges }
const options = {
  interaction: {
    navigationButtons: true,
    keyboard: true,
  },
  nodes: {
    shape: 'dot',
    size: 20,
    font: {
      size: 20,
    },
    borderWidth: 2,
    shadow: true,
  },
  edges: {
    width: 2,
    shadow: true,
    smooth: false,
  },
  physics: false,
}
// eslint-disable-next-line no-unused-vars
const network = new vis.Network(container, data, options)
// event when click node/agent for switching tab
network.on('click', (properties) => {
  const ids = properties.nodes
  const clickedNodes = nodes.get(ids)
  console.log('Clicked node: ', clickedNodes)
})


function updateNetwork() {
  function getNodeColorByStatus(status) {
    const active = 'lime'
    const busy = 'red'
    const received = 'orange'
    const listening = 'cyan'

    if (status === 'active') {
      return active
    }
    if (status === 'received') {
      return received
    }
    if (status === 'busy') {
      return busy
    }
    if (status === 'listening') {
      return listening
    }

    return undefined
  }

  const currentMachinesStatus = [
    {
      id: 0,
      color: { background: getNodeColorByStatus(market.props.status) },
      title: JSON.stringify(market.props),
    },
    {
      id: 1,
      color: { background: getNodeColorByStatus(machine1.props.status) },
      title: JSON.stringify(machine1.props),
    },
    {
      id: 2,
      color: { background: getNodeColorByStatus(machine2.props.status) },
      title: JSON.stringify(machine2.props),
    },
    {
      id: 3,
      color: { background: getNodeColorByStatus(machine3.props.status) },
      title: JSON.stringify(machine3.props),
    },
  ]
  nodes.update(currentMachinesStatus)

  edges.update([])
}

// eslint-disable-next-line no-unused-vars
function updateTransactionLogTable() {
  const logTableBody = $('#logTable').find('tbody')
  const { transactionLog } = market.props
  console.log(transactionLog)

  // eslint-disable-next-line array-callback-return
  transactionLog.map((transaction) => {
    logTableBody.append($('<tr>')
      .append($('<td>')
        .text(transaction.task.name))
      .append($('<td>')
        .text(transaction.price))
      .append($('<td>')
        .text(transaction.machine)))
  })
}

setInterval(() => updateNetwork(), 500)
changeColorBtn.click(() => updateNetwork())


// Switch tab page
const overviewNav = $('#overviewNav')
const machine1Nav = $('#machine1Nav')
const machine2Nav = $('#machine2Nav')
const machine3Nav = $('#machine3Nav')
const pages = $('.page')
const overviewPage = $('#overviewPage')
const machine1Page = $('#machine1Page')
const machine2Page = $('#machine2Page')
const machine3Page = $('#machine3Page')

overviewNav.click(() => {
  pages.addClass('d-none')
  overviewPage[0].classList.remove('d-none')
})

machine1Nav.click(() => {
  pages.addClass('d-none')
  machine1Page[0].classList.remove('d-none')
})
machine2Nav.click(() => {
  pages.addClass('d-none')
  machine2Page[0].classList.remove('d-none')
})
machine3Nav.click(() => {
  pages.addClass('d-none')
  machine3Page[0].classList.remove('d-none')
})
