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

  t.log(`input: ${input}`)
  t.log(`output: ${brain.react(input)}`)

  t.log(`answer: ${new SigmoidActivator().activate(1.547)}`)
  t.truthy(brain)
})

test(t => {
  const brain = BrainBuilder.new(new SigmoidActivator)
    .inputs(2)
    .layer(2)
    .layer(2)
    // .layer(2)
    // .depth(3)
    // .breadth(3)
    .outputs(1)
    .build()

  const andData = [
    [[0, 0, 1], [0]],
    [[0, 1, 1], [0]],
    [[1, 0, 1], [0]],
    [[1, 1, 1], [1]],
  ]

  const xorData = [
    [[0, 0], [0]],
    [[1, 0], [1]],
    [[0, 1], [1]],
    [[1, 1], [0]],
  ]

  const lineData = _.chunk(_.times(10000, () => Math.random() * 10), 2).map(([x, y]) => {
    return [[x,y], [y > x ? 1 : 0]]
  })

  // Examples:
  // [
  //   [[1, 2], [1]],
  //   [[1, 0], [0]],
  //   [[2, 2.5], [1]],
  //   [[1, 1.5], [1]],
  //   [[3, 1], [0]],
  //   [[4, 1], [0]],
  //   [[5, 1], [0]],
  // ]

  const trainingSet = xorData

  const trainer = new Trainer(brain, { learningRate: .1 })

  t.log('Before training...')
  // console.log(JSON.stringify(brain, null, 2))
  trainingSet.forEach(([input, output]) => {
    const reaction = brain.react(input)
    t.log(`react(${input}) -> ${reaction}`)
  })

  t.log('Training...')
  _.times(50000, () => {
    trainingSet.forEach(([input, output]) => {
      trainer.train(input, output)
    })

    // console.log(JSON.stringify(brain, null, 2))

  })
  t.log('After training...')
  trainingSet.forEach(([input, output]) => {
    const reaction = brain.react(input)
    t.log(`react(${input}) -> ${reaction}`)
  })

  // t.true(brain.react([0, 0, 1])[0] < 0.5)
  // t.true(brain.react([0, 1, 1])[0] < 0.5)
  // t.true(brain.react([0, 0, 1])[0] < 0.5)
  // t.true(brain.react([1, 1, 1])[0] >= 0.5)
})
