const uuidv1 = require('uuid/v1')

module.exports = function Task({
  id, type, name, geometry, materialProperties, requiredSurfaceQuality, amountOfAbrasion,
}) {
  this.id = id || uuidv1()
  this.type = type || 'bid_asking'
  this.name = name || 'grinding'
  this.geometry = geometry
  this.materialProperties = materialProperties
  this.requiredSurfaceQuality = requiredSurfaceQuality
  this.amountOfAbrasion = amountOfAbrasion
  this.status = 'pending'

  this.setStatus = (status) => {
    this.status = status
  }
}
