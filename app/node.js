
var Node = (function() {
  var id = 0

  return function Node(x, y) {
    this.id = id++;
    this.x = x
    this.y = y
    this.connections = []
      // this.n_connections = 0
  }
})()

Node.prototype.connected_to = function(edge_id) {
  return this.connections.indexOf(edge_id)
}


Node.prototype.other_side_is = function(nodeTo) {
  let world = require('world')
  return this.connections.find(edge_id => world.edges[edge_id].nodeTo.id==nodeTo.id )

}

Node.prototype.other_side = function(edge) {
  if (edge.nodeFrom == this) return edge.nodeTo
  if (edge.nodeTo == this) return edge.nodeFrom
  console.log("IMPOSSIBILE esser qui !!!")
}

Node.prototype.add_connection = function(edge_id) {
  this.connections.push(edge_id)
}

Node.prototype.remove_connection = function(edge_id) {
  _.remove(this.connections, edge => edge == edge_id)
}

Node.prototype.in = function(nodes) {
  // console.log(nodes)
  return _(nodes).find(n => this.equals(n))
}

Node.prototype.equals = function(node) {
  return node.x === this.x && node.y === this.y
}

Node.prototype.distance = function(x, y) {
  return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2))
}



module.exports = Node