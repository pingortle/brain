module.exports = Fold

function Fold(neurons) {
  this.neurons = neurons
}

Object.assign(Fold.prototype, { compute, react })

function compute(inputs) {
  return this.neurons.reduce(
    (result, neuron) => {
      const computation = neuron.compute(inputs)
      result.computations.push(computation)
      result.reactions.push(computation.reaction)
      return result
    },
    { reactions: [], computations: [] }
  )
}

function react(inputs) {
  return this.neurons.map(neuron => neuron.react(inputs))
}
