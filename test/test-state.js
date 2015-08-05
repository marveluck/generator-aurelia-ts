'use strict';

var path = require('path');
var generator = require('yeoman-generator');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var sinon = require('sinon');
var fs = require('fs');
var app;

// Need tests for all combinations??
describe('aurelia-ts:state', function () {
  this.spy = sinon.spy();
  var dummyGen = generator.Base.extend({
    exec: this.spy
  });

  this.npmInstallCalls = [];
  this.spawnCommandCalls = [];
  let jspmArgs;

  describe('install ampersand', function() {
    before(function(done) {
      app = helpers.run(path.join(__dirname, '../generators/state'))
        .withOptions({
          // ui: 'Bootstrap',
        })
        .withGenerators([
          [dummyGen, 'aurelia-ts:amp']
        ])
        .withPrompts({
          ampersand: true
        })
        .on('ready', function(generator) {
          generator.npmInstall = function() {
            this.npmInstallCalls.push(arguments);
          }.bind(this);
          generator.spawnCommand = function() {
            this.spawnCommandCalls.push(arguments);
          }.bind(this);
        }.bind(this))
        .on('end', function() {
          done();
        });
    }.bind(this));

    after(function() {
      this.npmInstallCalls.length = 0;
      this.spawnCommandCalls.length = 0;
      this.spy.reset();
    }.bind(this));

    it('generator can be run', function() {
      assert(app !== undefined);
    });

    it('just call once amp subgenerator', function() {
      assert(this.spy.calledOnce);
    }.bind(this));
  }.bind(this));

  describe('does not install ampersand', function() {
    before(function(done) {
      app = helpers.run(path.join(__dirname, '../generators/state'))
        .withOptions({
          // ui: 'Bootstrap',
        })
        .withGenerators([
          [dummyGen, 'aurelia-ts:amp']
        ])
        .withPrompts({
          ampersand: false
        })
        .on('ready', function(generator) {
          generator.npmInstall = function() {
            this.npmInstallCalls.push(arguments);
          }.bind(this);
          generator.spawnCommand = function() {
            this.spawnCommandCalls.push(arguments);
          }.bind(this);
        }.bind(this))
        .on('end', function() {
          done();
        });
    }.bind(this));

    it('generator can be run', function() {
      assert(app !== undefined);
    });

    it('does not call amp subgenerator', function() {
      assert(this.spy.called == false);
    }.bind(this));
  }.bind(this));


});
