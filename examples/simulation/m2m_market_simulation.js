const eve = require('../../index')
const MachineAgent = require('../agents/MachineAgent')
const MarketAgent = require('../agents/MarketAgent')

eve.system.init({
  transports: [
    {
      type: 'ws',
      // url: 'ws://agents/:id'
    }
  ]
})

const market = new MarketAgent('market')
const machine1 = new MachineAgent('machine1', 100)
const machine2 = new MachineAgent('machine2', 200)

// market.openBidSession(['machine1', 'machine2'], {
//   type: 'bids',
//   data: '123',
// })

market.transferRevenue('machine1', {
  type: 'reward',
  amount: 50,
})
