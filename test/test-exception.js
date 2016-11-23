'use strict';

// Testcase to produce NodeReport on uncaught exception
if (process.argv[2] === 'child') {
  require('../').setEvents('exception');

  function myException(request, response) {
    const m = '*** exception.js: testcase exception thrown from myException()';
    throw new UserException(m);
  }

  function UserException(message) {
    this.message = message;
    this.name = 'UserException';
  }

  myException();
} else {
  const common = require('./common.js');
  const spawn = require('child_process').spawn;
  const tap = require('tap');

  const child = spawn(process.execPath, [__filename, 'child']);
  child.on('exit', (code) => {
    tap.plan(3);
    tap.equal(code, 1, 'Process should exit with expected return code');
    const reports = common.findReports(child.pid);
    tap.equal(reports.length, 1, 'Found reports ' + reports);
    const report = reports[0];
    common.validate(tap, report, child.pid);
  });
}
