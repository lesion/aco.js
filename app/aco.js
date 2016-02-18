module.exports = (function() {

  const height = 500
  const width = 500

  let self = {}


  let world = require('world')
  let canvas = require('canvas')
  canvas.init(width, height, world)

  $(document).ready(function() {
    $('#reset').click(canvas.restart)
    $('#add_node').click(function(){world.add_random_node(width,height)})
    $('#add_edge').click(world.add_random_edge)
    $('#random_map').click(canvas.random_map)

    $('#cycle').click(world.cycle)
    $('#go_ant').click(world.add_ant)
  })

  return self
})()