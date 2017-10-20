import test from 'ava'
import _ from 'lodash'
import BrainBuilder from '../lib/brain-builder'
import Trainer from '../lib/trainer'
import SigmoidActivator from '../lib/activators/sigmoid'

test(t => {
  const size = 10
  const input = _.times(size, () => Math.random() * 10)
  const brain = BrainBuilder.new(new SigmoidActivator)
    .inputs(size)
    .depth(3)
    .breadth(3)
    .outputs(3)
    .build()

  t.truthy(brain)
})

test(t => {
  const brain = BrainBuilder.new(new SigmoidActivator)
    .inputs(2)
    .layer(2)
    .layer(2)
    .outputs(1)
    .build()

  // const andData = [
  //   [[0, 0, 1], [0]],
  //   [[0, 1, 1], [0]],
  //   [[1, 0, 1], [0]],
  //   [[1, 1, 1], [1]],
  // ]

  // const xorData = [
  //   [[0, 0], [0]],
  //   [[1, 0], [1]],
  //   [[0, 1], [1]],
  //   [[1, 1], [0]],
  // ]

  const lineData = _.chunk(_.times(100, () => Math.random() * 10), 2).map(([x, y]) => {
    return [[x,y], [y > x ? 1 : 0]]
  })

  const trainingSet = lineData

  const trainer = new Trainer(brain, { learningRate: .1 })

  const beforeError = trainingSet.reduce((error, [input, output]) => {
    const reaction = brain.react(input)

    let errors = _.zipWith(reaction, output, _.subtract).map(Math.abs)
    if (_.isNumber(error)) errors = errors.concat(error)

    return _.mean(errors)
  })

  _.times(100, () => {
    trainingSet.forEach(([input, output]) => {
      trainer.train(input, output)
    })
  })

  const afterError = trainingSet.reduce((error, [input, output]) => {
    const reaction = brain.react(input)

    let errors = _.zipWith(reaction, output, _.subtract).map(Math.abs)
    if (_.isNumber(error)) errors = errors.concat(error)

    return _.mean(errors)
  })

  t.true(beforeError > afterError)
})
