module.exports = Brain

function Brain(folds, outputNeuron, activator) {
  this.folds = folds
  this.outputNeuron = outputNeuron
  this.activator = activator
}

Object.assign(Brain.prototype, { react })

function react(inputs) {
  let reactions = this.folds.reduce(
    (lastResult, fold) => fold.react(lastResult),
    inputs
  )

  return this.outputNeuron.react(reactions)
}
