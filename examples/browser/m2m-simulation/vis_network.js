const $ = require('jquery')

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
const market = new MarketAgent('market')
const machine1 = new MachineAgent('machine1', {
  balance: 10,
  capabilities: [
    'grinding',
    'coating',
  ],
})
const machine2 = new MachineAgent('machine2', {
  balance: 20,
  capabilities: [
    'grinding',
    'case-hardening',
  ],
})

const machine3 = new MachineAgent('machine3', {
  balance: 40,
  capabilities: [
    'coating',
    'case-hardening',
  ],
})

// function to startSession a single match between player1 and player2
function startSession() {
  const tasks = ['coating', 'grinding', 'case-hardening']
  const testTask = {
    type: 'bid_asking',
    task: {
      id: 1,
      name: tasks[Math.floor(Math.random() * 3)],
    },
  }
  console.log('New Task: ', testTask)
  // send task to market
  market.openBidSession(['machine1', 'machine2', 'machine3'], testTask)

  document.getElementById('market').innerHTML = JSON.stringify(market.props)
  document.getElementById('machine1').innerHTML = JSON.stringify(machine1.props)
  document.getElementById('machine2').innerHTML = JSON.stringify(machine2.props)
  document.getElementById('machine3').innerHTML = JSON.stringify(machine3.props)
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
  },
}
// eslint-disable-next-line no-unused-vars
const network = new vis.Network(container, data, options)

network.on('click', (properties) => {
  const ids = properties.nodes
  const clickedNodes = nodes.get(ids)
  console.log('clicked nodes:', clickedNodes)
})

function updateNetwork() {
  const newColor = `#${Math.floor((Math.random() * 255 * 255 * 255))
    .toString(16)}`
  const active = 'lime'
  const busy = 'red'
  // eslint-disable-next-line no-unused-vars
  const idle = 'orange'
  nodes.update([
    {
      id: 1,
      color: { background: active },
      title: JSON.stringify(machine1.props),
    },
    {
      id: 2,
      color: { background: busy },
      title: JSON.stringify(machine2.props),
    },
    {
      id: 3,
      color: { background: newColor },
      title: JSON.stringify(machine3.props),
    },
  ])

  edges.update([])
}

setInterval(() => updateNetwork(), 1000)
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
