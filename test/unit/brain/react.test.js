import test, { test as it } from 'ava'
import Brain from '../../../lib/brain'

const folds = []
const inputs = []
const activate = () => {}
const activator = { activate }
const react = () => {}
const outputNeuron = { react }

test.beforeEach(t => Object.assign(t.context, { folds, outputNeuron, activator }))

function subject(t, overrides = {}) {
  const { folds, outputNeuron, activator } = t.context
  return Object.assign(new Brain(folds, outputNeuron, activator), overrides)
}

test('propagates inputs through the folds', t => {
  const inputs = [0]
  const foldValues = [1, 2, 3].map(x => Array.of(x))
  const expectedPropagation = [0, 1, 2].map(x => Array.of(x))
  const reactWithNextValue = (nextValue) => (input) => {
    const expected = expectedPropagation.shift()
    t.deepEqual(input, expected)
    return nextValue
  }

  const folds = foldValues.map(nextValue => {
    return { react: reactWithNextValue(nextValue) }
  })

  Object.assign(t.context, { folds })

  t.plan(folds.length)
  subject(t).react(inputs)
})

test('passes final inputs to output neuron', t => {
  const expected = 'a value'
  const react = () => expected
  const folds = [{ react }]

  const outputNeuron = { react: (input) => t.is(input, expected) }

  Object.assign(t.context, { folds, outputNeuron })

  t.plan(1)
  subject(t).react(inputs)
})

test('returns value from output neuron', t => {
  const expected = 'a value'
  const react = () => expected
  const outputNeuron = { react }
  Object.assign(t.context, { outputNeuron })

  t.is(subject(t).react(inputs), expected)
})
