module.exports = Neuron

function Neuron(weights, activator) {
  this.weights = weights
  this.activator = activator
}

Object.assign(Neuron.prototype, { activate, activatePrime, compute, react, weightedSum })

function activate(value) {
  return this.activator.activate(value)
}

function activatePrime(value) {
  return this.activator.activatePrime(value)
}

function weightedSum(inputs) {
  let weights = this.weights
  if (inputs.length != weights.length) throw `expected ${weights.length} number of inputs`

  return inputs.reduce(
    (result, value, index) => result + value * weights[index],
    0
  )
}

function compute(inputs) {
  let weightedSum = this.weightedSum(inputs)
  let reaction = this.activate(weightedSum)

  return { neuron: this, inputs, weightedSum, reaction }
}

function react(inputs) {
  let weightedSum = this.weightedSum(inputs)
  return this.activate(weightedSum)
}
