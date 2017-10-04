import Matrix from 'node-matrix'

function Outcome(session) {
  this.lesson = lesson
}

Object.assign(Outcome.prototype, { meditate })

function meditate(output) {
  return new Brain()
}

function Session(lesson) {
  this.lesson = lesson
}

Object.assign(Outcome.prototype, { practice })

function practice(input) {
  return new Outcome()
}

function Lesson(brain, activator) {
  this.brain = brain
  this.activator = activator
}

Object.assign(Lesson.prototype, { learn })

function learn(input, output) {
  return new Session(this).practice(input).meditate(output)
}
