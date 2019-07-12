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
