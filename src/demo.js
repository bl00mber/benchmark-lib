import * as React from 'react'
import { render } from 'react-dom'
import { Bench } from './index'

let fiboSeq = [1, 1]

for (let i = 2; i < 99; i++) {
  fiboSeq.push(fiboSeq[i-1]+fiboSeq[i-2])
}

const forLoop = function () {
  let cloned = fiboSeq.slice()
  for (let i = 0; i < cloned.length; i++) {
    cloned[i] /= 2
  }
}

const forEachLoop = function () {
  let cloned = fiboSeq.slice()
  cloned.forEach(o => {
    o /= 2
  })
}

export default render(
  <div>
    <Bench
      tests={[forLoop, forEachLoop]}
      benchName='benchmark'
      testNames={['forLoop', 'forEachLoop']}
      iterations={100000}
    />
    <Bench
      tests={[forLoop, forEachLoop]}
      benchName='benchmark'
      testNames={['forLoop', 'forEachLoop']}
      callbacks={{
        afterEach: (testName) => console.log(`test ${testName} completed`),
        afterAll: (result) => console.log(result),
      }}
      iterations={5000000}
      trigger='e'
      runOnInit={false}
    />
    <Bench
    />
  </div>,
  document.getElementById('root')
)
