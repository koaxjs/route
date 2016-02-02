/**
 * Imports
 */

import test from 'tape'
import {route, mount, request} from '../src'
import ware from '@koax/ware'

/**
 * Tests
 */

test('should route', (t) => {
  t.plan(2)

  let app = ware()

  app.use(route('/foo', () => 'bar'))
  app.use(route('/baz', () => 'qux'))

  app(request('/foo')).then((res) => t.equal(res, 'bar'))
  app(request('/baz')).then((res) => t.equal(res, 'qux'))
})

test('should route a sequence of requests', (t) => {
  let app = ware()

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
  let app = ware()

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
