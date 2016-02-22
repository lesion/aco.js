function Node(x, y) {

  this.x = x
  this.y = y

  this.connections = []
  this.connection_weight = []
}


Node.prototype.in = function(nodes) {
  return nodes.find(node => this.equals(node))
};

Node.prototype.add_connection = function(edge) {
    if(edge.in(this.connections))
  {
    console.log('connection gia presente')
    return
  }
  this.connections.push(edge)
  this.connection_weight.push(1)
}

Node.prototype.add_pherormone = function(edge) {
  // console.log('dentro add_pherormone')
  // console.log(edge)
  // console.log(edge.in_index(this.connections))
  // console.log(this.connection_weight)
  this.connection_weight[edge.in_index(this.connections)]+=0.5
};

Node.prototype.equals = function(node) {
  return node.x === this.x && node.y === this.y
}

Node.prototype.distance = function(x, y) {

  return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2))
}

module.exports = Node