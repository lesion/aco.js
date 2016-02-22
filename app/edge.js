function Edge(nodeFrom, nodeTo, do_not_connect) {


  if (nodeFrom.equals(nodeTo)) {
    console.log('Impossibile creare un arco tra due nodi equivalenti')
    throw new Error('Impossibile creare un arco tra due nodi equivalenti')
  }

  this.nodeFrom = nodeFrom
  this.nodeTo = nodeTo

  if (!do_not_connect) {

    nodeFrom.add_connection(this)

    nodeTo.add_connection(this)

    this.weight = this.length()

  }
}


Edge.prototype.length = function() {
  if (this.nodeFrom && this.nodeTo) {
    var lat1 = this.nodeFrom.x,
      lat2 = this.nodeTo.x,
      lon1 = this.nodeFrom.y,
      lon2 = this.nodeTo.y
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
      c(lat1 * p) * c(lat2 * p) *
      (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a));

    // return Math.sqrt(Math.pow(this.nodeFrom.x - this.nodeTo.x, 2) + Math.pow(this.nodeFrom.y - this.nodeTo.y, 2))
  } else
    return 0
}

Edge.prototype.add_pherormone = function() {
  this.pherormon++
};

Edge.prototype.in = function(edges) {
  return edges.findIndex(e => e.equals(this)) !== -1
}

Edge.prototype.in_index = function(edges) {
  return edges.findIndex(e => e.equals(this))
}


Edge.prototype.setFrom = function(nodeFrom) {
  this.nodeFrom = nodeFrom
  this.weight = this.length()
}

Edge.prototype.setTo = function(nodeTo) {
  this.nodeTo = nodeTo
  this.nodeFrom.add_connection(this)
  this.nodeTo.add_connection(this)
  this.weight = this.length()
}

Edge.prototype.equals = function(edge) {
  return (edge.nodeFrom.equals(this.nodeFrom) && edge.nodeTo.equals(this.nodeTo)) ||
    (edge.nodeTo.equals(this.nodeFrom) && edge.nodeFrom.equals(this.nodeTo))
}


Edge.prototype.connected = function(edge) {
  return (
    edge.nodeFrom.equals(this.nodeTo) ||
    edge.nodeTo.equals(this.nodeFrom) ||
    edge.nodeFrom.equals(this.nodeFrom) ||
    edge.nodeTo.equals(this.nodeTo)
  )
};


module.exports = Edge