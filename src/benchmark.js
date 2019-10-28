/*
Copyright (c) Nick Reiley (https://github.com/bl00mber) <bloomber111@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

const random = require('lodash.random')

const benchmark = function(test1Poly, test2, benchName, testNames, callbacks,
  iterations, logEach
) {
  const tests = []

  if (!test1Poly && !test2) throw new TypeError('at least 1 test needs to be specified')

  if (test1Poly.constructor.name == 'Array') {
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
    benchName = 'bench-'+random(100000, 999999)
  }

  if (testNames) {
    if (testNames.constructor.name !== 'Array') throw new TypeError('testNames should be array')
  }

  if (callbacks) {
    Object.values(callbacks).forEach(o => {
      if (!!o && typeof o !== 'function') throw new TypeError('callbacks should be functions if defined')
    })
  } else {
    callbacks = {}
  }

  if (iterations) {
    if (typeof iterations !== 'number') throw new TypeError('iterations value should be number')
  } else {
    iterations = 500
  }

  if (logEach) {
    if (typeof logEach !== 'number') throw new TypeError('logEach value should be number')
  } else {
    if (logEach !== 0) logEach = 100
  }


  let testCounter = 0
  let stop = false
  let res = {}
  const benchStart = new Date()
  if (callbacks.beforeAll) callbacks.beforeAll()


  tests.forEach(test => {
    testCounter += 1
    const testName = testNames[testCounter-1] || 't'+testCounter
    if (callbacks.beforeEach) callbacks.beforeEach(testName, testCounter)

    const testStart = new Date()

    for (let i = 0; i < iterations; i++) {
      test()
      if (logEach && Number.isInteger(i / logEach))
        console.log(i, 'iteration', testName)
    }
    const testEnd = new Date()

    const ms = testEnd - testStart
    res[testName] = ms
    if (callbacks.afterEach) callbacks.afterEach(testName, ms)
  })


  const benchEnd = new Date()
  const benchDuration = benchEnd - benchStart

  const fastestMS = Math.min(...Object.values(res))
  const slowestMS = Math.max(...Object.values(res))

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

  if (callbacks.afterAll) callbacks.afterAll(bench)
  return bench
}

export default benchmark
