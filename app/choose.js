module.exports = function(possibilities, probabilities) {

  let roulette_wheel = probabilities.reduce((tot, v) => tot += v, 0)
  let wheel_target = roulette_wheel * Math.random()
  let tot = 0

  for(let idx in probabilities)
  {
    tot+=probabilities[idx]
    if(tot>=wheel_target)
      return possibilities[idx]
  }

}

/**
 * 
 * var choose = require('choose')
 *
 * var possibilities = ['Green','Blue','White']
 * var probabilities = [ 2.5, 3.5, 4 ]
 * var ret = { 'Green','Blue','White' }
 * 
 * for(var i=0;i<100000;i++){ ret[c(possibilities,probabilities)]++ }
 * Object {Green: 24888, Blue: 35087, White: 40025}
 * 
 */