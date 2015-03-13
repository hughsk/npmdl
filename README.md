# npmdl
![](http://img.shields.io/badge/stability-experimental-orange.svg?style=flat)
![](http://img.shields.io/npm/v/npmdl.svg?style=flat)
![](http://img.shields.io/npm/dm/npmdl.svg?style=flat)
![](http://img.shields.io/npm/l/npmdl.svg?style=flat)

Conveniently download files from npm packages, caching
the results on the file system.

You could use this to build your own [npm-cdn](http://github.com/zeke/npm-cdn),
or a simple [requirebin](http://requirebin.com)-type editor. Note however
that because scripts aren't run that some packages might not work this way.

## Usage

[![NPM](https://nodei.co/npm/npmdl.png)](https://nodei.co/npm/npmdl/)

### `dl = npmdl([directory])`

Creates a new downloader, using `directory` to store downloaded
packages in. `directory` defaults to `~/.npmdl`.

### `dl(package, version, filename, done)`

Downloads `package@version`, and calls `done(err, content)`
with the contents of `filename` when complete. If already
downloaded, the file will be read out directly so we can
save bandwidth and go a little easier on the npm registry :)

``` javascript
var npmdl = require('npmdl')

npmdl(__dirname)('browserify', '9.0.0', 'bin/advanced.txt', function(err, content) {
  if (err) throw err

  // logs browserify@9.0.0's advanced help to the console
  console.log(content)
})
```

## License

MIT. See [LICENSE.md](http://github.com/hughsk/npmdl/blob/master/LICENSE.md) for details.
