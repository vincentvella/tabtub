const { execSync } = require('child_process')
const fs = require('fs')

exports.default = function (context) {
  // Execute the below command
  // esbuild main/preload.ts --external:electron --bundle --minify --sourcemap --outfile=app/preload.js

  execSync('esbuild main/preload.ts --external:electron --bundle --minify --sourcemap --outfile=app/preload.js')
}