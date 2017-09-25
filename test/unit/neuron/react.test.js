import test, { test as it } from 'ava'
import Neuron from '../../../lib/neuron'

test.beforeEach(t => {
  let weights = [0.1, 0.2, 0.3]
  let subject = new Neuron(weights)

  Object.assign(t.context, { weights, subject })
})

test('sums weighted inputs', t => {
  let inputs = [1, 2, 3]
  let expected = 1.4

  t.is(t.context.subject.react(inputs), expected)
})
