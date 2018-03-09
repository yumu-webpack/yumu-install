#!/usr/bin/env node

'use strict';

var unzip = require('unzip');
var download = require('download');
var fs = require('fs');
var process = require('process');
var child_process = require('child_process');
var inquirer = require('inquirer');
var chalk = require('chalk');
var ora = require('ora');
var pkg = require('./package.json');

var url = 'https://github.com/yumu-webpack/yumu-template/archive/master.zip';
var options = [
  ['-V', '--version', 'The version of yumu-init'],
  ['-h', '--help', 'The help of yumu-init']
]

var spinner = ora({
  text: 'You are installing the dependencies',
  spinner: 'circleQuarters'
});

module.exports = {
  pkg: pkg,
  options: options,
  init: init,
  action: action
}

function action (option, version) {
  if(option == 'version') {
    console.log(chalk.cyan('  ' + version));
  }
  if(option == 'help') {
    outputHelpInfo(options);
  }
}

function outputHelpInfo(options) {
  console.log(chalk.yellow('  Usage: init [option] <type>'));
  console.log('');
  console.log(chalk.yellow('  yumu init'));
  console.log('');
  console.log(chalk.yellow('  Options:'));
  console.log('');
  for( var i = 0; i < options.length; i ++ ) {
    var str = '  ' + options[i][0] + ', ' + options[i][1] + getSpace(24, options[i][1]) + options[i][2];
    console.log(chalk.yellow(str));
  }
  console.log('');
}

function getSpace(total, str) {
  var spaceStr = '';
  var len = total - str.length;
  while(len){
    spaceStr += ' ';
    len --;
  }
  return spaceStr;
}

function init() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'resource',
      message: 'Please choose the resource that you want to install',
      choices: [
        'npm',
        'cnpm'
      ],
      default: 'npm'
    }
  ]).then(function(answers) {
    console.log('');
    var resource = answers.resource;
    var getResult
    try {
      spinner.start();
      getResult = child_process.execSync(resource + ' install', { encoding: 'utf8' });
      console.log('');
      spinner.stop();
    } catch(err) {
      console.log(err.stderr);
    }
    process.stdout.write(getResult);
  });
}
