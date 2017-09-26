import test, { test as it } from 'ava'
import Neuron from '../../../lib/neuron'

let weights = [0.1, 0.2, 0.3]
let inputs = [1, 2, 3]

function subject(t) {
  return new Neuron(weights)
}

test('sums weighted inputs', t => {
  const value = subject(t).weightedSum(inputs)
  t.is(value, 1.4)
})
