import test, { test as it } from 'ava'
import Neuron from '../../../lib/neuron'

const weights = []
const activate = (value) => {}
const activator = { activate }

function subject(t) {
  return new Neuron(t.context.weights, t.context.activator)
}

test.beforeEach(t => {
  Object.assign(t.context, { weights, activator })
})

test('delegates to activator', t => {
  const activate = () => t.pass()
  t.context.activator = { activate }

  t.plan(1)
  subject(t).activate()
})
