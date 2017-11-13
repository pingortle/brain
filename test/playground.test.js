import test from 'ava'
import _ from 'lodash'
import BrainBuilder from '../lib/brain-builder'
import Trainer from '../lib/trainer'
import SigmoidActivator from '../lib/activators/sigmoid'
import mnist from 'mnist'

test(t => {
  const size = 10
  const input = _.times(size, () => Math.random() * 10)
  const brain = BrainBuilder.new(new SigmoidActivator)
    .inputs(size)
    .layer(3)
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

test(t => {
  const size = 28 * 28
  const brain = BrainBuilder.new(new SigmoidActivator)
    .inputs(size)
    .layer(15)
    .outputs(10)
    .build()

  function selected(output) {
    return output.indexOf(_.max(output))
  }

  const trainer = new Trainer(brain, { learningRate: 1 })

  const totalSessions = 30
  const trainingCount = 2000
  const testCount = 10000
  const set = mnist.set(trainingCount, testCount)
  _.times(30, (sessionNumber) => {
    const set = mnist.set(trainingCount, testCount)
    console.log(`Session ${sessionNumber + 1}/${totalSessions}...`)
    set.training.forEach(({ input, output }, index) => {
      trainer.train(input, output)
    })

    const successes = set.test
      .map(({ input, output }) => selected(brain.react(input)) == selected(output))
      .filter(_.identity)
      .length
    console.log(`  Session complete: ${successes}/${testCount} successes...`)
  })

  const results = brain.react(set.test[0].input)

  set.test.forEach(({ input, output }) => {
    const result = brain.react(input)
  })

  t.is(selected(brain.react(set.training[0].input)), selected(set.training[0].output))
  t.is(selected(results), selected(set.test[0].output))
})
