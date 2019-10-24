const random = require('lodash.random')

const benchmark = function(test1Poly, test2, benchName, testNames, callbacks,
  iterations, logEach
) {
  const tests = []

  if (!test1Poly && !test2) throw new TypeError('at least 1 test needs to be specified')

  if (typeof test1Poly === 'array') {
    if (test1Poly.length === 0) throw new TypeError('if benchmark has only one argument as a test, it needs to be an array of tests (functions)')

    test1Poly.forEach(o => {
      if (typeof o !== 'function') throw new TypeError('tests should be functions')
      tests.push(o)
    })
  } else {
    if (test1Poly) {
      if (typeof test1Poly !== 'function') throw new TypeError('tests should be functions')
      tests.push(test1Poly)
    }
    if (test2) {
      if (typeof test2 !== 'function') throw new TypeError('tests should be functions')
      tests.push(test1Poly)
    }
  }

  if (benchName) {
    if (typeof benchName !== 'string') throw new TypeError('benchmark name should be string')
  } else {
    benchName = 'bench-'+random(1000000, 9999999)
  }

  if (testNames) {
    if (typeof testNames !== 'array') throw new TypeError('testNames should be array')
  }

  if (callbacks) {
    callbacks.forEach(o => {
      if (!!o && typeof o !== 'function') throw new TypeError('callbacks should be functions if defined')
    })
  } else {
    callbacks = []
  }

  if (iterations) {
    if (typeof iterations !== number) throw new TypeError('iterations value should be number')
  } else {
    iterations = 500
  }

  if (logEach) {
    if (typeof logEach !== number) throw new TypeError('logEach value should be number')
  } else {
    logEach = 100
  }


  let testCounter = 0
  let res = {}
  const benchStart = new Date()
  if (callbacks[0]) callbacks[0]()

  tests.forEach(test => {
    testCounter += 1
    const testName = testNames[testCounter-1] || 't'+testCounter
    if (callbacks[3]) callbacks[3]()

    const testStart = new Date()
    for (let i = 0; i < iterations; i++) { test() }
    const testEnd = new Date()

    const result = testEnd - testStart
    res[testName] = result
    if (callbacks[4]) callbacks[4]()
  })

  if (callbacks[1]) callbacks[1]()
  const benchEnd = new Date()
  const benchDuration = benchEnd - benchStart

  const fastestMS = Math.max(Object.values(res))
  const slowestMS = Math.min(Object.values(res))

  let fastestTest = ''
  let slowestTest = ''

  Object.keys(res).forEach(testName => {
    if (res[testName] === fastestMS) fastestTest = testName
    if (res[testName] === slowestMS) slowestTest = testName
  })

  const bench = {
    fastestTest, slowestTest, fastestMS, slowestMS, res,
    opt: {
      benchName, benchStart, benchEnd, benchDuration, iterations, callbacks,
    },
  }

  return bench
}

export default benchmark
