import test, { test as it } from 'ava'
import Fold from '../../../lib/fold'

let create = (...params) => new Fold(...params)

test('returns reactions from neurons', t => {
  let reactions = [1, 2]
  let neurons = reactions.map(reaction => ({ react: () => reaction }))
  let subject = create(neurons)

  t.deepEqual(subject.react(), reactions)
})

test('passes inputs to neurons', t => {
  const neurons = [{ react: (input) => input }]
  const subject = create(neurons)
  const inputs = [1, 2, 3]

  t.deepEqual(subject.react(inputs), [inputs])
})
