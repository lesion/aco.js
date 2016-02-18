function Edge(nodeFrom, nodeTo) {

  // if(nodeFrom.equals(nodeTo)) return null

  this.nodeFrom = nodeFrom
  this.nodeTo = nodeTo

  nodeFrom.add_connection(this)
  nodeTo.add_connection(this)

  this.weight = this.length()

  console.log(this.weight)
  this.pherormon = 1
}


Edge.prototype.length = function() {
  if(this.nodeFrom && this.nodeTo)
    return Math.sqrt(Math.pow(this.nodeFrom.x - this.nodeTo.x, 2) + Math.pow(this.nodeFrom.y - this.nodeTo.y, 2))
  else
    return 0
}

Edge.prototype.add_pherormone = function() {
  this.pherormon++
};

Edge.prototype.in = function(edges) {
  return edges.findIndex(e=>e.equals(this))!==-1
};


Edge.prototype.setFrom = function(nodeFrom) {
  this.nodeFrom = nodeFrom
  this.weight = this.length()
}

Edge.prototype.setTo = function(nodeTo) {
  this.nodeTo = nodeTo
  this.weight = this.length()
};

Edge.prototype.equals = function(edge) {
  return (edge.nodeFrom.equals(this.nodeFrom) && edge.nodeTo.equals(this.nodeTo)) ||
          (edge.nodeTo.equals(this.nodeFrom) && edge.nodeFrom.equals(this.nodeTo))
}


Edge.prototype.connected = function(edge) {
  return (
    edge.nodeFrom.equals(this.nodeFrom) ||
    edge.nodeFrom.equals(this.nodeTo) ||
    edge.nodeTo.equals(this.nodeFrom) ||
    edge.nodeTo.equals(this.nodeTo))
};


module.exports = Edge