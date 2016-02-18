function Node(x, y) {

  this.x = x
  this.y = y

  this.connections = []
  this.connection_weight = []

}

Node.prototype.add_connection = function(edge) {
  this.connections.push(edge)
  this.connection_weight.push(0)
}

Node.prototype.equals = function(node) {
  return node.x === this.x && node.y === this.y
}

Node.prototype.distance = function(x, y) {
  return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2))
}

module.exports = Node