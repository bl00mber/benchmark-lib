# Benchmark-lib
```shell-script
npm install benchmark-lib --save
```

- A tool for **computing** and **logging** benchmarks
- React component for rendering programmatically or manually injected benchmarks


## Contents
- [benchmark](#benchmark)
- [Example](#example)
- [Bench](#benchmark-component)
- [Support](https://www.paypal.me/bloomber/20)


## benchmark
```js
import { benchmark } from 'benchmark-lib'

benchmark(foo, bar)
benchmark([foo, bar, baz])
```

Other arguments (`null` can be passed to skip argument)

```js
benchmark(
  foo, bar, 'benchName',
  ['test1Name', 'test2Name'], iterations,
  {beforeAll, afterAll, beforeEach, afterEach},
  logEach
)

benchmark([foo, bar, baz], null, 'benchName')
```

To return results as an object with summary info and an array of objects with computed results

```js
const b = benchmark([foo, bar, baz])
```

- **b.fastestTest** - string - test name
- **b.slowestTest** - string - test name
- **b.fastestMS** - number
- **b.slowestMS** - number
- **b.opt** - object
  - **b.opt.benchName**
  - **b.opt.benchStart** - Date
  - **b.opt.benchEnd** - Date
  - **b.opt.benchDuration** - ms
  - **b.opt.iterations** - number
  - **b.opt.callbacks** - object - {beforeAll...}
- **b.res** - object - computed results
  - **b.res.t1** - number - test time in `ms`
  - **b.res.t2**

Default test names is t1, t2...

<table>
  <tr>
    <th> Name </th>
    <th> Type </th>
    <th> Default </th>
    <th> Description </th>
  </tr>
  <tr>
    <td> iterations </td>
    <td> number </td>
    <td> 500 </td>
    <td> </td>
  </tr>
  <tr>
    <td> logEach </td>
    <td> number </td>
    <td> 0 </td>
    <td> log during each `n` iteration, `0` will log result </td>
  </tr>
</table>


## Callbacks args
```js
afterAll(result)
beforeEach(testName, testCounter)
afterEach(testName, ms)
```


## Example
### for, forEach
```js
let fiboSeq = [1, 1]

const beforeAll = function () {
  for (let i = 2; i < 99; i++) {
    fiboSeq.push(fiboSeq[i-1]+fiboSeq[i-2])
  }
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

benchmark(forLoop, forEachLoop, 'for, forEach benchmark', ['for', 'forEach'])
```


## Benchmark component
```jsx
import { Bench } from 'benchmark-lib'
import 'benchmark-lib/dist/style.css'

<Bench
  firstTest={foo}
  secondTest={bar}
/>

<Bench
  tests={[foo, bar, baz]}
  benchName='benchmark'
  testNames={['foo', 'bar', 'baz']}
  iterations={500}
  callbacks={{beforeAll, afterAll, beforeEach, afterEach}}
/>
```

<table>
  <tr>
    <td> hide </td>
    <td> array </td>
    <td> {['benchName', 'iterations', 'testNames', 'bars']} </td>
  </tr>
  <tr>
    <td> trigger </td>
    <td> literal </td>
    <td> to run benchmark using keyboard, default `b` </td>
  </tr>
  <tr>
    <td> disableTrigger </td>
    <td> bool </td>
    <td> </td>
  </tr>
  <tr>
    <td> runOnInit </td>
    <td> bool </td>
    <td> </td>
  </tr>
  <tr>
    <td> shortenIters </td>
    <td> bool </td>
    <td> </td>
  </tr>
  <tr>
    <td> convertMS </td>
    <td> bool </td>
    <td> </td>
  </tr>
</table>


## License
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/bl00mber/benchmark-lib/blob/master/LICENSE)

Make sure you have donated for lib maintenance: [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/bloomber/20)
