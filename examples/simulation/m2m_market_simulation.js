// init with eve config
eve.system.init({
  transports: [
    {
      type: 'ws'
    }
  ]
});

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
// startSession a single match
startSession();

// function to startSession a single match between player1 and player2
function startSession(){
  // market do smt
  market.transferRevenue('machine1', {
    type: 'reward',
    amount: 10,
  })
  market.transferRevenue('machine2', {
    type: 'reward',
    amount: 5,
  })

  document.getElementById("handP1").innerHTML = JSON.stringify(machine1.props);
  document.getElementById("handP2").innerHTML = JSON.stringify(machine2.props);
}
