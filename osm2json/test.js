var obj = require('./piossa.json')
var Node = require('../app/node.js')
var Edge = require('../app/edge.js')

// console.log(obj)


var strade = obj.features.filter(o => o.properties.hasOwnProperty('highway') &&
  ['unclassified', 'residential', 'primary', 'tertiary', 'primary-link'].indexOf(o.properties.highway) > -1)


// add nodes before
// var nodes = []
// var edges = []

// strade.forEach(strada => {
//     console.log(strada.properties.name)
//     console.log(strada.geometry.coordinates.length)
//     strada.geometry.coordinates.forEach(nodo => {
//       var node = new Node(nodo[0], nodo[1])
//       if (!node.in(nodes)) {
//         console.log('Aggiungo nodo ' + nodes.length)
//         nodes.push(node)
//       } else {
//         console.log('nodo gia esiste')
//       }
//     })
//   })




// strade.forEach(strada => {
//     console.log(strada.properties.name)
//     console.log(strada.geometry.coordinates.length)
//     strada.geometry.coordinates.forEach(nodo => {
//       var node = new Node(nodo[0], nodo[1])
//       if (!node.in(nodes)) {
//         console.log('Aggiungo nodo ' + nodes.length)
//         nodes.push(node)
//       } else {
//         console.log('nodo gia esiste')
//       }
//     })
//   })


var max_x = 0
var min_x = Infinity
var min_y = Infinity
var max_y = 0

var edges = []
strade.forEach( strada =>
{
  var from_node = null
  strada.geometry.coordinates.forEach( nodo =>{
    nodo[0] -= 7.4245208
    nodo[1] -= 44.9628869
    max_x = (nodo[0]>max_x?nodo[0]:max_x)
    max_y = (nodo[1]>max_y?nodo[1]:max_y)
    min_x = (nodo[0]<min_x?nodo[0]:min_x)
    min_y = (nodo[1]<min_y?nodo[1]:min_y)
    // var edge = [nodo[0],nodo[1]]
    if(!from_node){
      from_node = nodo
      return
    }
    if((from_node[0]==nodo[0] && from_node[1]==nodo[1])) return
    edges.push([[from_node[0],from_node[1]],[nodo[0],nodo[1]]])
    from_node = nodo
  })
})

console.log(JSON.stringify(edges.map(e => [[e[0][0]*900/max_x,e[0][1]*500/max_y],
  [e[1][0]*900/max_x,e[1][1]*500/max_y],])))
// console.log("min_x: ", min_x )
// console.log("min_y: ", min_y )
// console.log("max_x: ", max_x )
// console.log("max_y: ", max_y )

// console.log('nodi: ' + nodes.length)
// console.log('archi: ' + edges.length)

  // strade.forEach( s => console.log(s))

// console.log(strade.length)
// console.log(strade)