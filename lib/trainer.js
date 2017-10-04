const _ = require('lodash')

function purty(object, indent = 2) {
  return JSON.stringify(object, null, indent)
}

function pp(object, ...rest) {
  console.log(purty(object, ...rest))
}

DEFAULT_LEARNING_RATE = 0.0001

function Trainer(brain, options = {}) {
  const { learningRate } = options

  this.brain = brain
  this.learningRate = learningRate || Trainer.DEFAULT_LEARNING_RATE
}

Object.assign(Trainer, {
  DEFAULT_LEARNING_RATE,
  calculateOutputSensitivities,
  calculateFinalOutputSensitivity,
  calculateLayerSensitivity
})

Object.assign(Trainer.prototype, { train, learn })

function learn(layers, sensitivities) {
  const windowed = _.zip(layers, [null].concat(layers.slice(0, -1)))
  _.zipWith(windowed, sensitivities, ([{ computations }, inputLayer], sensitivities) => {
    _.zipWith(computations, sensitivities, ({ neuron, inputs }, sensitivity) => {
      const rawInputs = inputLayer ?
       inputLayer.computations.map(computation => computation.weightedSum) :
       inputs

      const activatedInputs = rawInputs.map(neuron.activator.activate)

      neuron.weights = _.zipWith(neuron.weights, activatedInputs, (weight, input) => {
        const gradient = input * sensitivity
        return weight - this.learningRate * gradient
      })
    })
  })
}

function train(inputs, targets) {
  const reasoning = this.brain.compute(inputs)
  const finalOutputSensitivities = calculateFinalOutputSensitivity(reasoning.reactions, targets)
  const sensitivities = calculateOutputSensitivities(reasoning, finalOutputSensitivities)

  this.learn(reasoning.computations, sensitivities)
}

module.exports = Trainer

function calculateFinalOutputSensitivity(outputs, targets) {
  return _.zipWith(outputs, targets, (output, target) => 2 * (output - target))
}

function calculateOutputSensitivities({ computations }, finalOutputSensitivities) {
  const sensitivitiesForLayers = [finalOutputSensitivities]
  computations.slice(0, -1).reduceRight(
    (sensitivities, computation, index) => {
      return _.tap(
        calculateLayerSensitivity(computation, computations[index + 1], sensitivities),
        sensitivities =>  sensitivitiesForLayers.unshift(sensitivities)
      )
    },
    finalOutputSensitivities
  )

  return sensitivitiesForLayers
}

function calculateLayerSensitivity({ computations }, { computations: nextComputations }, sensitivities) {
  const weights = _.zip(...nextComputations.map(({ neuron }) => neuron.weights))
  return _.zipWith(computations, weights,
    (computation, weights) => calculateNeuronSensitivity(computation, weights, sensitivities)
  )
}

function calculateNeuronSensitivity({ neuron, weightedSum }, weights, sensitivities) {
  const primeActivation = neuron.activator.activatePrime(weightedSum)
  const elements = _.zipWith(
    weights,
    sensitivities,
    (weight, sensitivity) => weight * sensitivity
  )

  return primeActivation * _.sum(elements)
}
