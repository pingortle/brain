module.exports = Neuron

function Neuron(weights) {
  this.weights = weights
}

Object.assign(Neuron.prototype, { react })

function react(inputs) {
  let weights = this.weights
  if (inputs.length != weights.length) throw `expected ${weights.length} inputs`

  return inputs.reduce(
    (result, value, index) => result + value * weights[index],
    0
  )
}
