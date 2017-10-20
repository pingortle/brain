const _ = require('lodash')

DEFAULT_LEARNING_RATE = 0.75

function Trainer(brain, options = {}) {
  const { learningRate } = options

  this.brain = brain
  this.learningRate = learningRate || Trainer.DEFAULT_LEARNING_RATE
}

Object.assign(Trainer, {
  DEFAULT_LEARNING_RATE
})

Object.assign(Trainer.prototype, { train })

function train(inputs, targets) {
  adjustWeights(this.brain, this.brain.compute(inputs), targets, this.learningRate)
}

module.exports = Trainer

function calculateLayerSenitivities(left, right, previousLayerSensitivites) {
  return left.neurons.map((neuron, index) => {
    const outputWeights = right.neurons.map(neuron => neuron.weights[index])
    return _.sum(_.zipWith(outputWeights, previousLayerSensitivites, _.multiply))
  })
}

function calculateBrainSensitivities(brain, computation, expected) {
  const output = _.last(computation.computations).reactions
  const outputSensitivities = _.zipWith(expected, output, _.subtract)
  const pairedLayers = _.zip(brain.folds.slice(0, -1), brain.folds.slice(1))

  return pairedLayers.reduceRight(
    (list, [left, right]) => {
      const sensitivities = calculateLayerSenitivities(left, right, _.first(list))
      list.unshift(sensitivities)
      return list
    },
    [outputSensitivities]
  )
}

function adjustWeights(brain, computation, expected, learningRate) {
  const sensitivities = calculateBrainSensitivities(brain, computation, expected)
  _.zipWith(computation.computations, sensitivities, ({ computations }, sensitivities) => {
    _.zipWith(computations, sensitivities, ({ neuron, weightedSum, reaction, inputs }, sensitivity) => {
      const delta = learningRate * reaction * sensitivity * neuron.activatePrime(weightedSum)
      neuron.weights = _.zipWith(neuron.weights, inputs, (weight, input) => weight + delta * input)
    })
  })
}
