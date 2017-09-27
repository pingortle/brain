const Brain = require('./brain')
const Fold = require('./fold')
const Neuron = require('./neuron')

function BrainBuilder(activator) {
  this.activator = activator
  this.inputSize = 1
  this.foldDepth = 1
  this.foldBreadth = 1
}

const { prototype } = BrainBuilder

Object.assign(prototype, { inputs, depth, breadth, build })

BrainBuilder.new = function (...params) {
  return new BrainBuilder(...params)
}

function inputs(size) {
  this.inputSize = size
  return this
}

function depth(size) {
  this.foldDepth = size
  return this
}

function breadth(size) {
  this.foldBreadth = size
  return this
}

function build() {
  const depth = this.foldDepth
  const breadth = this.foldBreadth
  const sizes = [this.inputSize].concat(Array(depth - 1).fill(breadth))

  const folds = Array(depth).fill(0).map(() => {
    const size = sizes.shift()
    const neurons = Array(breadth).fill(0).map(() => {
      const weights = Array(size).fill(0).map(Math.random)
      return new Neuron(weights, this.activator)
    })

    return new Fold(neurons)
  })

  const outputWeights = Array(breadth).fill(0).map(Math.random)
  const outputNeuron = new Neuron(outputWeights, this.activator)

  return new Brain(folds, outputNeuron)
}

module.exports = BrainBuilder
