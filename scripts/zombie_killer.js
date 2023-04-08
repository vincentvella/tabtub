const os = require('os')
const cron = require('node-cron')
const ps = require('ps-node')
const pidusage = require('pidusage')

const isWindows = os.platform() === 'win32'

if (isWindows) {
	cron.schedule("*/10 * * * * *", function () {
		ps.lookup({ command: 'node' }, function (err, resultList) {
			if (err) {
				console.error(err)
				throw new Error(err);
			}

			let youngestProcessMap = {}

			resultList.forEach(function (process) {
				if (process) {
					if (process.command.includes('tabtub')) {
						pidusage(process.pid, function (err, stats) {
							if (stats) {
								const key = `${process.command}-${process.arguments.reduce((acc, curr) => acc += curr, '')}`
								if (!youngestProcessMap[key]) {
									youngestProcessMap[key] = stats
								} else if (stats.elapsed < youngestProcessMap[key].elapsed) {
									ps.kill(youngestProcessMap[key].pid)
									youngestProcessMap[key] = stats
								}
							}
						})
					}
				}
			});
		});
	})
}