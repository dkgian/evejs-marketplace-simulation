const uuid = require('uuid-v4')

const msgType = require('../../constants/message_type')
const taskStatus = require('../../constants/task_status')


module.exports = function Task({
  id,
  type,
  name,
  geometry,
  materialProperties,
  requiredSurfaceQuality,
  strategy,
}) {
  this.id = id || uuid()
  this.type = type || msgType.BID_ASKING
  this.name = name || 'grinding'
  this.geometry = geometry
  this.materialProperties = materialProperties || {}
  this.requiredSurfaceQuality = requiredSurfaceQuality
  this.status = taskStatus.PENDING
  this.strategy = strategy
}
