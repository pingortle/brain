function Sigmoid() {}

Object.assign(Sigmoid.prototype, { activate, activatePrime })

function activate(x) {
  return 1 / (1 + Math.exp(-x))
}

function activatePrime(x) {
  return activate(x) * (1 -  activate(x))
}

module.exports = Sigmoid
