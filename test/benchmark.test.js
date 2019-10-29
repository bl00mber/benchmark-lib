import { benchmark } from '../src/index'


const forLoop = () => {}
const forEachLoop = () => {}


describe('benchmark', () => {
  test('returns expected object structure', () => {
    const b = benchmark(forLoop, forEachLoop, 'benchmark', ['forLoop', 'forEachLoop'], 10)

    expect(b).toMatchObject({
      fastestTest: expect.any(String),
      slowestTest: expect.any(String),
      fastestMS: expect.any(Number),
      slowestMS: expect.any(Number),
      res: expect.objectContaining({
        forLoop: expect.any(Number),
        forEachLoop: expect.any(Number),
      }),
      opt: expect.objectContaining({
        benchName: expect.stringContaining('benchmark'),
        benchStart: expect.any(Date),
        benchEnd: expect.any(Date),
        benchDuration: expect.any(Number),
        iterations: expect.any(Number),
        callbacks: expect.any(Object),
      }),
    })
  })

  test('performs expected count of iterations', () => {
    const b = benchmark(forLoop, forEachLoop, 'benchmark', ['forLoop', 'forEachLoop'], 10)
    expect(b.opt.iterations).toBe(10)
  })
})
