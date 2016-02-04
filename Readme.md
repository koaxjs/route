
# route

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

Simple route middlekoax for koax.

## Installation

    $ npm install @koax/route

## Usage

```js
import koax from 'koax'
import {route, request} from '@koax/route'

let router = koax()

router.use(route('/dep', () => 'norf'))
router.use(route('/foo', function * () {
  let res = yield request('/dep')
  return 'bar ' + res
}))

router(request('/foo')).then((res) => res) // => 'bar norf'
```

## API

### route(path, handler)
Route middleware.

- `path` - path
- `handler` - function to execute on matched path. `handler` has signature `handler(params)`.

**Returns:** koax middleware

### request(path, params)
Request action creator.

- `path` - path to request
- `params` - params to path to handler

**Returns:** action object

### mount(path, middleware)
Mount middleware.

- `path` - path to mount middleware at
- `middleware` - middleware to mount

**Returns:** koax middleware

## License

MIT

[travis-image]: https://img.shields.io/travis/koaxjs/route.svg?style=flat-square
[travis-url]: https://travis-ci.org/koaxjs/route
[git-image]: https://img.shields.io/github/tag/koaxjs/route.svg
[git-url]: https://github.com/koaxjs/route
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/@koax/route.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@koax/route
