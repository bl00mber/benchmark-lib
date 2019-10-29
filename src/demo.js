import * as React from 'react'
import { render } from 'react-dom'
import { Bench } from './index'

let fiboSeq = [1, 1]

for (let i = 2; i < 99; i++) {
  fiboSeq.push(fiboSeq[i-1]+fiboSeq[i-2])
}

const forLoop = function () {
  let clone = fiboSeq.slice()
  for (let i = 0; i < clone.length; i++) {
    clone[i] /= 2
  }
}

const forEachLoop = function () {
  let clone = fiboSeq.slice()
  clone.forEach((o, i) => {
    clone[i] = o / 2
  })
}

const mapLoop = function () {
  let clone = fiboSeq.slice()
  clone = clone.map(o => {
    return o / 2
  })
}

const sliceClone = function () {
  let clone = fiboSeq.slice()
}

const spreadClone = function () {
  let clone = {...fiboSeq}
}

export default render(
  <div>
    <Bench
      tests={[forLoop, forEachLoop]}
      benchName='for, forEach'
      testNames={['for', 'forEach']}
      iterations={100000}
      trigger='f'
    />
    <Bench
      tests={[forLoop, forEachLoop]}
      benchName='forEach, map'
      testNames={['forEach', 'map']}
      callbacks={{
        afterEach: (testName) => console.log(`test ${testName} completed`),
        afterAll: (result) => console.log(result),
      }}
      iterations={5000000}
      trigger='e'
      runOnInit={false}
    />
    <Bench
      tests={[sliceClone, spreadClone]}
      benchName='arr shallow clone'
      testNames={['slice', 'spread']}
      iterations={3000}
      trigger='c'
    />
  </div>,
  document.getElementById('root')
)
