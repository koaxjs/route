/**
 * Action
 */

const ROUTE = 'ROUTE'

/**
 * Route middleware
 * @param  {String} path  path of handler
 * @param  {Function} fn  handler
 * @return {Function}     redux style middleware
 */

function route (path, fn) {
  path = normalizePath(path)
  return function * (action, next) {
    if (action.type === ROUTE && action.payload.path === path) {
      return fn(action.payload)
    } else {
      return next()
    }
  }
}

/**
 * Mount a middleware stack
 * @param  {String} path  path to mount middleware
 * @param  {Function} mw  middleware stack
 * @return {Fucntion}     redux style middleware
 */

function mount (path, mw) {
  path = normalizePath(path)
  return function * (action, next, ctx) {
    if (action.type === ROUTE && action.payload.path.indexOf(path) === 0) {
      return mw({
        ...action.payload,
        path: action.payload.path.slice(path.length)
      }, next, ctx)
    } else {
      return next()
    }
  }
}

/**
 * Create a route request
 * @param  {String} path   request path
 * @param  {Object} params request params
 * @return {Object}        action
 */

function request (path, params) {
  path = normalizePath(path)
  return {type: ROUTE, payload: {path, params, ctx: {}}}
}

/**
 * Normalize a path
 * @param  {String} path path
 * @return {String}      path
 */

function normalizePath (path) {
  if (path[path.length - 1] === '/') {
    return path.slice(0, path.length - 1)
  } else {
    return path
  }
}

/**
 * Exports
 */

export {route, mount, request}
