// create an array with nodes
/* eslint-disable no-undef */
const $ = require('jquery')

const nodes = new vis.DataSet([
  {
    id: 0,
    label: 'Market',
  },
  {
    id: 1,
    label: 'Machine 1',
  },
  {
    id: 2,
    label: 'Machine 2',
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
const container = document.getElementById('mynetwork')
const changeColorBtn = $('#changeColorBtn')

const data = {
  nodes,
  edges,
}
const options = {}
// eslint-disable-next-line no-unused-vars
const network = new vis.Network(container, data, options)

function changeNode1() {
  const newColor = `#${Math.floor((Math.random() * 255 * 255 * 255))
    .toString(16)}`
  nodes.update([
    {
      id: 1,
      color: { background: newColor },
    },
    {
      id: 2,
      color: { background: newColor },
    },
    {
      id: 3,
      color: { background: newColor },
    },
  ])
}

changeColorBtn.click(() => changeNode1())
