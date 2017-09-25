import test from 'ava'
import index from '../index'

let apis = ['Neuron']

test(`exports ${apis.join(', ')}`, t => {
  apis.forEach(api => t.truthy(index[api]))
})
