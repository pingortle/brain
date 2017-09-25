module.exports = Fold

function Fold(neurons) {
  this.neurons = neurons
}

Object.assign(Fold.prototype, { react })

function react(inputs) {
  return this.neurons.map(neuron => neuron.react(inputs))
}
