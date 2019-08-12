const uuidv1 = require('uuid/v1')

module.exports = function Task({
  id, name, geometry, materialProperties, requiredSurfaceQuality, amountOfAbrasion,
}) {
  this.id = id || uuidv1()
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
