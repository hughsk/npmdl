const rimraf = require('rimraf')
const test   = require('tape')
const path   = require('path')
const npmdl  = require('./')
const fs     = require('fs')

const testDir = path.join(__dirname, '.test')

test('setup', function(t) {
  if (fs.existsSync(testDir))
    rimraf.sync(testDir)

  t.end()
})

test('npmdl', function(t) {
  t.plan(12)

  ;['9.0.0', '8.0.0'].forEach(function(version) {
    npmdl(testDir)('browserify', version, 'package.json', function(err, content) {
      if (err) return t.fail(err.message || err)

      t.pass('version: ' + version)
      t.ok(fs.existsSync(path.join(testDir, 'browserify')), 'package directory created')
      t.ok(fs.existsSync(path.join(testDir, 'browserify', version)), 'version directory created')
      t.ok(fs.existsSync(path.join(testDir, 'browserify', version, 'package')), 'files directory created')
      t.ok(fs.existsSync(path.join(testDir, 'browserify', version, 'package', 'package.json')), 'package.json created')
      t.equal(fs.readFileSync(path.join(testDir, 'browserify', version, 'package', 'package.json'), 'utf8'), content, 'content argument matches')
    })
  })
})

test('teardown', function(t) {
  rimraf.sync(testDir)
  t.end()
})
