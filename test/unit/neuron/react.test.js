import test, { test as it } from 'ava'
import Neuron from '../../../lib/neuron'

const weights = []
const inputs = []
const activate = () => {}
const activator = { activate }

test.beforeEach(t => Object.assign(t.context, { weights, activator }))

function subject(t, overrides = {}) {
  return Object.assign(new Neuron(t.context.weights, t.context.activator), overrides)
}

test('sums weighted inputs', t => {
  const weightedSum = (inputs) => t.pass()

  t.plan(1)
  subject(t, { weightedSum }).react(inputs)
})

test('activates the weighted sum', t => {
  const sum = 'a value'
  const weightedSum = () => sum
  const activate = (value) => t.is(value, sum)

  t.plan(1)
  subject(t, { activate, weightedSum }).react(inputs)
})

test('returns the activated value', t => {
  const activatedValue = 'activated value'
  const activate = (value) => activatedValue

  const value = subject(t, { activate }).react(inputs)
  t.is(value, activatedValue)
})
