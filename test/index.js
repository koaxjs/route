/**
 * Imports
 */

import test from 'tape'
import {route, mount, request} from '../src'
import koax from 'koax'

/**
 * Tests
 */

test('should route', (t) => {
  t.plan(2)

  let app = koax()

  app.use(route('/foo', () => 'bar'))
  app.use(route('/baz', () => 'qux'))

  app(request('/foo')).then((res) => t.equal(res, 'bar'))
  app(request('/baz')).then((res) => t.equal(res, 'qux'))
})

test('should route a sequence of requests', (t) => {
  let app = koax()

  app.use(route('/foo', () => 'bar'))
  app.use(route('/baz', () => 'qux'))

  app(function * () {
    let res = yield request('/foo')
    t.equal(res, 'bar')
    res = yield request('/baz')
    t.equal(res, 'qux')
    t.end()
  })
})

test('should work with generator handlers', (t) => {
  let app = koax()

  app.use(route('/dep', function * () {
    return 'norf'
  }))
  app.use(route('/foo', function * () {
    return yield ['bar', request('/dep')]
  }))
  app.use(route('/baz', function * () {
    return ['qux', yield request('/dep')]
  }))

  app(function * () {
    let res = yield request('/foo')
    t.deepEqual(res, ['bar', 'norf'])
    res = yield request('/baz')
    t.deepEqual(res, ['qux', 'norf'])
    t.end()
  })
})


test('should be able to mount router', (t) => {
  t.plan(3)

  let app = koax()

  let sub = koax()
  sub.use(route('/foo', () => 'bar'))
  sub.use(route('/baz/', () => 'qux'))

  app.use(mount('/woot', sub))

  app(request('/woot/foo')).then((res) => t.equal(res, 'bar'))
  app(request('/woot/foo/')).then((res) => t.equal(res, 'bar'))
  app(request('/woot/baz')).then((res) => t.equal(res, 'qux'))
})

test('* should catch all', (t) => {
  t.plan(2)

  let app = koax()

  app.use(route('*', () => 'bar'))
  app.use(route('/baz', () => 'qux'))

  app(request('/foo')).then((res) => t.equal(res, 'bar'))
  app(request('/baz')).then((res) => t.equal(res, 'bar'))
})
