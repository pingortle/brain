const _ = require('lodash')
const Brain = require('./brain')
const Fold = require('./fold')
const Neuron = require('./neuron')

function BrainBuilder(activator) {
  this.activator = activator
  this.inputSize = 1
  this.outputSize = 1
  this.foldDepth = 0
  this.foldBreadth = 0
  this.layerSizes = []
}

const { prototype } = BrainBuilder

Object.assign(prototype, { inputs, outputs, layer, depth, breadth, build })

BrainBuilder.new = function (...params) {
  return new BrainBuilder(...params)
}

function inputs(size) {
  this.inputSize = size
  return this
}

function outputs(size) {
  this.outputSize = size
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

function layer(size) {
  this.layerSizes.push(size)
  return this
}

function build() {
  const depth = this.foldDepth
  const breadth = this.foldBreadth
  const foldWeights = [this.inputSize].concat(this.layerSizes)
  const foldSizes = foldWeights.slice(1).concat([this.outputSize])

  const folds = _.zipWith(foldWeights, foldSizes, (weightsSize, size) => {
    const neurons = _.times(size, () => {
      const weights = _.times(weightsSize, Math.random)
      return new Neuron(weights, this.activator)
    })

    return new Fold(neurons)
  })

  return new Brain(folds)
}

module.exports = BrainBuilder
