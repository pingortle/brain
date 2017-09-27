import test from 'ava'
import BrainBuilder from '../lib/brain-builder'
import SigmoidActivator from '../lib/activators/sigmoid'

test(t =>{
  const brain = BrainBuilder.new(new SigmoidActivator)
    .depth(3)
    .breadth(3)
    .inputs(3)
    .build()

  t.log(brain.react([1, 1, 0]))
  t.truthy(brain)
})
