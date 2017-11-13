const Neuron = require('./lib/neuron')
const Brain = require('./lib/brain')
const Fold = require('./lib/fold')
const BrainBuilder = require('./lib/brain-builder')
const Trainer = require('./lib/trainer')

const Activators = {}
Activators.Sigmoid = require('./lib/activators/sigmoid')

module.exports = { Activators, Neuron, Brain, Fold, BrainBuilder, Trainer }
