module.exports = Brain

function Brain(folds) {
  this.folds = folds
}

Object.assign(Brain.prototype, { compute, react })

function compute(inputs) {
  const result = { inputs, computations: [] }
  result.reactions = this.folds.reduce(
    (lastResult, fold) => {
      const computation = fold.compute(lastResult)
      result.computations.push(computation)
      return computation.reactions
    },
    inputs
  )

  return result
}

function react(inputs) {
  return this.folds.reduce((inputs, fold) => fold.react(inputs), inputs)
}
