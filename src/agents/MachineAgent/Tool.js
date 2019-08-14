module.exports = function Tool({
  name, forMaterials, harness, surfaceQuality,
}) {
  this.name = name
  this.forMaterials = forMaterials || ['X', 'Y', 'Z']
  this.harness = harness
  this.surfaceQuality = surfaceQuality
}
