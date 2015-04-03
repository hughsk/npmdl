const userhome = require('userhome')
const request  = require('request')
const tar      = require('tar-fs')
const mkdirp   = require('mkdirp')
const zlib     = require('zlib')
const path     = require('path')
const url      = require('url')
const fs       = require('fs')

module.exports = NpmDownloader

function NpmDownloader(root) {
  mkdirp.sync(root = root || userhome('.npmdl'))

  return getFile

  function getFile(name, vers, file, done) {
    name = sanitize(name).replace(path.sep, '')
    vers = sanitize(vers).replace(path.sep, '')
    file = sanitize(file)

    // For safety :D
    if (!name) return done(new Error('Missing package name'))
    if (!vers) return done(new Error('Missing package version ('+name+')'))
    if (!file) return done(new Error('Missing package file ('+name+'@'+vers+')'))

    var pkgDir  = path.join(root, name, vers)
    var pkgFile = path.join(root, name, vers, 'package', file)

    fs.exists(pkgDir, function(exists) {
      if (exists) {
        return fs.readFile(pkgFile, 'utf8', done)
      }

      downloadPkg(name, vers, pkgDir, function(err) {
        if (err) return done(err)

        return fs.readFile(pkgFile, 'utf8', done)
      })
    })
  }

  function downloadPkg(name, version, dest, done) {
    var uri = [
      name, '-',
      name +'-'+version+'.tgz'
    ].join('/')

    uri = url.resolve('http://registry.npmjs.com', uri)

    request.get(uri)
      .pipe(zlib.createGunzip())
      .pipe(tar.extract(dest))
      .on('error', done)
      .on('finish', done)
  }

  function sanitize(chunk) {
    chunk = chunk || ''
    chunk = chunk.replace(/%2e/ig, '.')
    chunk = chunk.replace(/%2f|%5c/ig, '/')
    chunk = chunk.replace(/[\/\\]/g, '/')
    chunk = chunk.replace(/[\/\\]\.\.[\/\\]/g, '')
    chunk = chunk.replace(/^\/+/g, '')

    return chunk
  }
}
