var uuid = require('uuid-v4')

const msgType = require('../../constants/message_type')
const taskStatus = require('../../constants/task_status')


module.exports = function Task({
  id,
  type,
  name,
  geometry,
  materialProperties,
  requiredSurfaceQuality,
  amountOfAbrasion,
}) {
  this.id = id || uuid()
  this.type = type || msgType.BID_ASKING
  this.name = name || 'grinding'
  this.geometry = geometry
  this.materialProperties = materialProperties || {}
  this.requiredSurfaceQuality = requiredSurfaceQuality
  this.amountOfAbrasion = amountOfAbrasion
  this.status = taskStatus.PENDING

  this.setStatus = (status) => {
    this.status = status
  }
  this.getStatus = () => this.status
}
