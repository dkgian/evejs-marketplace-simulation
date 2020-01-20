module.exports = function Tool({
  forMaterials, hardness, surfaceQuality,
}) {
  this.forMaterials = forMaterials || ['X', 'Y', 'Z']
  this.hardness = hardness
  this.surfaceQuality = surfaceQuality
  this.wearOffLevel = 0
  this.toolingTimes = 0
}
