var Edge = (function() {
  var id = 0


  return function Edge(nodeFrom, nodeTo, one_way, rotonda) {

    if (nodeFrom.equals(nodeTo))
      throw new Error('Impossibile creare un arco tra due nodi equivalenti')

    if( nodeFrom.other_side_is(nodeTo) )
      throw new Error('Edge gia presente!!')

    if(nodeTo.other_side_is(nodeFrom))
      throw new Error('Edge gia presentsdf se!!')

    this.id = id++
    this.nodeFrom = nodeFrom
    this.nodeTo = nodeTo
    nodeFrom.add_connection(this.id)
    this.weight = this.length()
    this.one_way = one_way
    this.rotonda = rotonda
    if(!this.one_way){
      nodeTo.add_connection(this.id)
    }
    return id
  }

})()


Edge.prototype.in = function(edges) {
  return edges.find(function(e){this.equals(e)})
};


Edge.prototype.length = function() {
  // if (this.nodeFrom && this.nodeTo) {
  //   var lat1 = this.nodeFrom.x,
  //     lat2 = this.nodeTo.x,
  //     lon1 = this.nodeFrom.y,
  //     lon2 = this.nodeTo.y
  //   var p = 0.017453292519943295; // Math.PI / 180
  //   var c = Math.cos;
  //   var a = 0.5 - c((lat2 - lat1) * p) / 2 +
  //     c(lat1 * p) * c(lat2 * p) *
  //     (1 - c((lon2 - lon1) * p)) / 2;

  //   return 12742 * Math.asin(Math.sqrt(a));
  //   
  return this.nodeFrom.distance(this.nodeTo.x,this.nodeFrom.y)

    // return Math.sqrt(Math.pow(this.nodeFrom.x - this.nodeTo.x, 2) + Math.pow(this.nodeFrom.y - this.nodeTo.y, 2))
  // } else
    // return 0
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
  return ((edge.nodeFrom == this.nodeFrom && edge.nodeTo==this.nodeTo) ||
    (edge.nodeTo==this.nodeFrom && edge.nodeFrom==this.nodeTo))
}



module.exports = Edge