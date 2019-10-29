import { render, fireEvent, cleanup, waitForElement } from '@testing-library/react'
import React from 'react'
import { Bench } from '../src/index'


afterEach(cleanup)

describe('<Bench />', () => {
  test('iterations number shortened', async () => {
    const { container: ct } = render(
      <Bench
        iterations={1000}
      />)

    await waitForElement(() => ct.querySelector('.bench-run__btn'))
    expect(ct.querySelector('.bench-iters').textContent.split(' ')[0]).toBe('1k')
  })

  test('bar of first test rendered as 100%', async () => {
    const { container: ct } = render(
      <Bench
      />)

    await waitForElement(() => ct.querySelector('.bench-results__bar'))
    expect(ct.querySelector('.bench-results__bar').style.width).toBe('100%')
  })
})
