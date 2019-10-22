# Benchmark-lib
```shell-script
npm install benchmark-lib --save
```

- A tool for **computing** and **logging** benchmarks
- React component for rendering programmatically or manually injected benchmarks

## Contents
- [benchmark](#benchmark)
- [Example](#example)
- [Benchmark](#benchmark-component)
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
  ['test1Name', 'test2Name'],
  [beforeAll, afterAll, beforeEach, afterEach],
  iterations, logEach
)
```

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
    <td> 100 </td>
    <td> log during each `n` iteration, if `0` will log only log final result </td>
  </tr>
</table>

Instead of logging `benchmark` can be used to return results as an object with summary info and an array of objects with computed results

```js
const b = benchmark([foo, bar, baz])
```

- **b.fastest** - string - test name
- **b.slowest** - string - test name
- **b.opt** - object
  - **b.opt.name** - default name is an SHA-1 hash
  - **b.opt.start** - Date
  - **b.opt.end** - Date
  - **b.opt.iterations** - number
  - **b.opt.callbacks** - object - {beforeAll...}
- **b.res** - object - computed results
  - **b.res.t1** - number - test time in `ms`
  - **b.res.t2**

Default test names is t1, t2...

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
    fiboSeq[i] /= 2
  })
}

benchmark(forLoop, forEachLoop, 'for, forEach benchmark', ['for', 'forEach'])
```

## Benchmark component
```jsx
import { Benchmark } from 'benchmark-lib'
import 'benchmark-lib/dist/style.css'

<Benchmark
  firstTest={foo}
  secondTest={bar}
/>

<Benchmark
  tests={[foo, bar, baz]}
  benchName='benchmark'
  testnames={['foo', 'bar', 'baz']}
  hooks={[beforeAll, afterAll, beforeEach, afterEach]}
  iterations={500}
  logEach={100}
/>
```

## License
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/bl00mber/benchmark-lib/blob/master/LICENSE)

Make sure you have donated for lib maintenance: [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/bloomber/20)
