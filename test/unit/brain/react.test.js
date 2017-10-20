import test, { test as it } from 'ava'
import Brain from '../../../lib/brain'

const folds = []
const inputs = []
const react = () => {}

test.beforeEach(t => Object.assign(t.context, { folds }))

function subject(t, overrides = {}) {
  const { folds, activator } = t.context
  return Object.assign(new Brain(folds, activator), overrides)
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

test('returns value from folds', t => {
  const expected = 'a value'
  const react = () => expected
  const folds = [{ react }]

  Object.assign(t.context, { folds })

  t.is(subject(t).react(inputs), expected)
})
