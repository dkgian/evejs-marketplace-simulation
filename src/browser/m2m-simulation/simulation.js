const $ = require('jquery')
const vis = require('vis')
const _ = require('lodash')

const Task = require('../../agents/TaskAgent/Task')
const TaskAgent = require('../../agents/TaskAgent/TaskAgent')
const MarketAgent = require('../../agents/MarketAgent/MarketAgent')
const MachineAgent = require('../../agents/MachineAgent/MachineAgent')
const Tool = require('../../agents/MachineAgent/Tool')
const TaskQueue = require('../../agents/MachineAgent/TaskQueue')
const { OFFLINE, AVAILABLE, PROCESSING } = require('../../constants/machine_status')
const { LISTENING } = require('../../constants/marketplace_status')

// EVE AGENTS PART=====================START================================
/* eslint-disable no-undef */
// init with eve config
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
  strategy: '',
  status: LISTENING,
  balance: {
    moneyIn: {},
    moneyOut: {},
  },
})

const machine1 = new MachineAgent('machine1', {
  balance: 10,
  geometries: ['A', 'B'],
  tool: new Tool({
    forMaterials: ['materialA, materialB'],
    hardness: 7,
    surfaceQuality: 7,
  }),
  status: AVAILABLE,
  taskQueue: new TaskQueue(),
})

const machine2 = new MachineAgent('machine2', {
  balance: 10,
  geometries: ['B', 'C'],
  tool: new Tool({
    forMaterials: ['materialA, materialB'],
    hardness: 6,
    surfaceQuality: 6,
  }),
  status: AVAILABLE,
  taskQueue: new TaskQueue(),
})

const machine3 = new MachineAgent('machine3', {
  balance: 10,
  geometries: ['A', 'C'],
  tool: new Tool({
    forMaterials: ['materialA, materialB'],
    hardness: 5,
    surfaceQuality: 5,
  }),
  status: AVAILABLE,
  taskQueue: new TaskQueue(),
})

let taskId = 1
function startSession() {
  const strategy = document.getElementById('strategy').value

  function generateTasks() {
    const geometries = ['A', 'B', 'C']

    const task = new Task({
      id: taskId,
      geometry: geometries[_.random(0, 2)],
      materialProperties: {
        hardness: _.random(3, 7),
      },
      requiredSurfaceQuality: _.random(1, 4),
      strategy,
    })
    taskId += 1
    return task
  }

  setInterval(() => {
    const newTask = generateTasks()
    taskAgent.sendTask('market', newTask)
  }, 2000)
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
    label: 'Machines 1',
    title: 'Machines 1 is active',
  },
  {
    id: 2,
    label: 'Machines 2',
    title: 'Machines 2 is running',
  },
  {
    id: 3,
    label: 'Machines 3',
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
const networkVisElement = document.getElementById('networkVis')

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
const network = new vis.Network(networkVisElement, data, options)
// event when click node/agent for switching tab
network.on('click', (properties) => {
  const ids = properties.nodes
  const clickedNodes = nodes.get(ids)
  console.log('Clicked node: ', clickedNodes)
})


function updateNetwork() {
  function getNodeColorByStatus(status) {
    if (status === OFFLINE) {
      return 'black'
    }
    if (status === AVAILABLE) {
      return 'lime'
    }
    if (status === 'received') {
      return 'orange'
    }
    if (status === PROCESSING) {
      return 'red'
    }
    if (status === 'listening') {
      return 'cyan'
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

setInterval(() => updateNetwork(), 500)

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
