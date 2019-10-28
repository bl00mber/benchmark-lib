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

import * as React from 'react'
import Pt from 'prop-types'
import benchmark from './benchmark'
import randomColor from 'randomcolor'

import './Bench.scss'

export default class Bench extends React.Component {
  static propTypes = {
    firstTest: Pt.func,
    secondTest: Pt.func,
    tests: Pt.arrayOf(Pt.func),
    benchName: Pt.string,
    testNames: Pt.arrayOf(Pt.string),
    callbacks: Pt.objectOf(Pt.func),
    iterations: Pt.number,
    logEach: Pt.number,

    hide: Pt.arrayOf(Pt.string),
    trigger: Pt.string,
    disableTrigger: Pt.bool,
    runOnInit: Pt.bool,
    shortenIters: Pt.bool,
    convertMS: Pt.bool,
  }

  static defaultProps = {
    firstTest: null,
    secondTest: null,
    tests: null,
    benchName: null,
    testNames: null,
    callbacks: null,
    iterations: 500,
    logEach: 100,

    hide: [],
    trigger: 'b',
    disableTrigger: false,
    runOnInit: true,
    shortenIters: true,
    convertMS: true,
  }

  constructor (props) {
    super()
    this.state = {
      benchName: props.benchName,
      disabled: true,
      resProcessed: null,
    }
  }

  componentDidMount() {
    if (!this.props.disableTrigger) document.addEventListener('keydown', this.handleKeydown)
    if (this.props.runOnInit) this.runBenchmark()
  }

  componentWillUnmount() {
    if (!this.props.disableTrigger) document.removeEventListener('keydown', this.handleKeydown)
  }

  handleKeydown = (e) => {
    if (e.keyCode === this.props.trigger.toUpperCase().charCodeAt(0) && this.state.disabled)
      this.runBenchmark()
  }

  processRes = (res, slowestMS) => {
    const resEntries = Object.entries(res)
    const percent = slowestMS / 100
    let resProcessed

    if (this.state.resProcessed) {
      resProcessed = this.state.resProcessed.map(o => {
        resEntries.forEach(item => {
          if (o.name === item[0]) {
            o.ms = item[1]
            o.percent = item[1] === slowestMS ? 100 : Math.ceil(item[1] / percent)
          }
        })
        return o
      })
    } else {
      resProcessed = []

      resEntries.forEach(item => {
        resProcessed.push({
          name: item[0],
          ms: item[1],
          percent: item[1] === slowestMS ? 100 : Math.ceil(item[1] / percent),
          background: randomColor(),
        })
      })
    }
    return resProcessed.sort((a, b) => a.percent - b.percent).reverse()
  }

  runBenchmark = () => {
    this.setState({ disabled: false }, () => setTimeout(() => {
      const test1Poly = this.props.tests || this.props.firstTest
      const { test2, benchName, testNames, callbacks, iterations, logEach } = this.props
      const b = benchmark(test1Poly, test2, benchName, testNames,
        callbacks, iterations, logEach)

      const resProcessed = this.processRes(b.res, b.slowestMS)
      this.setState({ disabled: true, resProcessed, benchName: b.opt.benchName })
    }, 0))
  }

  getIterValue = () => {
    const { iterations, shortenIters } = this.props
    if (shortenIters && iterations > 1000) {
      if (iterations > 1000000) {
        if (iterations > 1000000000) {
          return (Math.trunc(iterations/1000000000))+'b'
        } else {
          return (Math.trunc(iterations/1000000))+'m'
        }
      } else { return (Math.trunc(iterations/1000))+'k' }
    } else {
      return iterations
    }
  }

  time = (ms) => {
    if (ms > 1000) {
      if (ms > 60000) {
        return this.round(ms/60000)+'min'
      } else {
        return this.round(ms/1000)+'s'
      }
    }
    return ms+'ms'
  }

  round = (n) => Math.round((n+Number.EPSILON)*10)/10

  render () {
    const { testNames, hide, trigger, convertMS } = this.props
    const { benchName, resProcessed, disabled } = this.state
    return(
      <div className="bench__container">
        {!hide.includes('benchName') && <div className="bench-name">{benchName}</div>}
        {!hide.includes('iterations') && <div className="bench-iters">{this.getIterValue()} iterations</div>}

        {resProcessed && resProcessed.map((test, index) =>
          <div key={index} className="bench-results__container">

            {!hide.includes('testNames') && <div
              className="bench-results__header">{test.name} - {convertMS ? this.time(test.ms) : test.ms+'ms'} - {test.percent}%</div>}

            {!hide.includes('bars') && <div className="bench-results__bar"
              style={{width: test.percent+'%', background: test.background}}></div>}
          </div>)}

        {!resProcessed && testNames && testNames.map((name, index) =>
          <div key={index} className="bench-results__header">{name}</div>)}

        {disabled ? <div className="bench-run__btn"
          onClick={this.runBenchmark}>{!this.props.disableTrigger && trigger}</div> :
          <div className="lds-ellipsis">
            <div></div><div></div><div></div><div></div></div>}
      </div>
    )
  }
}
