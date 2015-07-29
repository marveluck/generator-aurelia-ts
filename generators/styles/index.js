'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
require('sugar');
var fs = require('node-fs-extra');

var defaultUI;

var generator;

function prepare4Tpl(list) {
  return list.map(function(item) {
    return "'" + item + "'";
  });
}

function info(msg) {
  console.log(msg);
}

function command(msg) {
  console.log('  $ ' + msg);
}

function stylesPath(folder) {
  return ['styles', folder].join('/');
}

function stylesFolder(lang) {
  return lang.toLowerCase();
}

function containsFor(list) {
  return function contains(value) {
    return list.indexOf(value) >= 0;
  }
}

module.exports = yeoman.generators.Base.extend({

  // note: arguments and options should be defined in the constructor.
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

    generator = this;
    this.props = {};

    this.option('sass');
    this.option('stylus');

    this.defaultStyles = [];
    if (this.options.sass) {
      this.defaultStyles.push('SASS')
    }
    if (this.options.stylus) {
      this.defaultStyles.push('Stylus')
    }

    this.styleLang = this.defaultStyles[0] || 'css';
  },

  initializing: function() {
  },

  prompting: function() {
    var done = this.async();

    var prompts = [{
      type: 'checkbox',
      name: 'styles',
      choices: [
        'None (CSS)',
        'Stylus',
        'SASS'
      ],
      default: this.defaultStyles,
      message: 'CSS Preprocessors'
    }, {
      type: 'prompt',
      name: 'removeOld',
      default: false,
      message: 'Remove old styles'
    }];

    this.prompt(prompts, function(answers) {
      this.styles = answers.styles;

      var contains = containsFor(this.styles);

      this.css = contains('None (CSS)');
      this.sass = contains('SASS');
      this.stylus = contains('Stylus');
      this.removeOld = answers.removeOld;

      this.preProcessors = [];
      if (this.sass) {
        this.preProcessors.push('sass')
      }
      if (this.stylus) {
        this.preProcessors.push('stylus')
      }

      this.styleLangs = this.preProcessors.slice(0);

      if (this.css) {
        this.styleLangs.push('css');
      }
      // this.config.save();

      done();
    }.bind(this));
  },

  // See File API: https://github.com/sboudrias/mem-fs-editor
  writing: {
    clearOld: function() {
      var self = this;
      if (!this.removeOld) return;
      for (let folder of ['css', 'stylus', 'sass']) {
        var path = this.destinationPath(stylesPath(folder));
        if (fs.existsSync(path)) {
          fs.removeSync(path, function(err) {
            info('deleted:' + path);
          });
        }
      }

      var path = this.destinationPath('styles/styles.css');
      if (fs.existsSync(path)) {
        fs.remove(path, function(err) {
          info('deleted:' + path);
        });
      }
    },

    styleFiles: function() {
      var self = this;
      for (let lang of this.styleLangs) {
        var folder = stylesFolder(lang);
        var path = stylesPath(folder);
        this.bulkDirectory(path, path);
      }
    },

    cssBuildTask: function() {
      var watchTasks = [];
      if (this.sass) {
        watchTasks.push('sass:watch');
      }
      if (this.stylus) {
        watchTasks.push('stylus:watch');
      }
      var preProcessors = prepare4Tpl(this.preProcessors);
      watchTasks = prepare4Tpl(watchTasks);

      this.fs.copyTpl(
        this.templatePath('styles/tasks/_css.js'),
        this.destinationPath('build/tasks/css.js'), {
          preProcessors: preProcessors,
          watchTasks: watchTasks,
          styles: this.styleLangs.join(' and '),
        }
      );
    },

    cssPreProcessorTasks: function() {
      if (this.sass) {
        this.fs.copy(
          this.templatePath('styles/tasks/sass.js'),
          this.destinationPath('build/tasks/sass.js')
        );
      }

      if (this.stylus) {
        this.fs.copy(
          this.templatePath('styles/tasks/stylus.js'),
          this.destinationPath('build/tasks/stylus.js')
        );
      }
    }
  },

  install: function() {
    if (this.sass) {
      generator.npmInstall('gulp-sass', {saveDev: true});
    }
    if (this.stylus) {
      generator.npmInstall('gulp-stylus', {saveDev: true});
    }
  },

  end: function() {
    info("Installed:" + this.preProcessors.join(' '));
  }
});
