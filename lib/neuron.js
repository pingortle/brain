module.exports = Neuron

function Neuron(weights, activator) {
  this.weights = weights
  this.activator = activator
}

Object.assign(Neuron.prototype, { activate, react, weightedSum })

function activate(value) {
  return this.activator.activate(value)
}

function weightedSum(inputs) {
  let weights = this.weights
  if (inputs.length != weights.length) throw `expected ${weights.length} number of inputs`

  return inputs.reduce(
    (result, value, index) => result + value * weights[index],
    0
  )
}

function react(inputs) {
  let weightedSum = this.weightedSum(inputs)
  return this.activate(weightedSum)
}
