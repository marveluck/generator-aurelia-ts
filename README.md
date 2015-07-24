# generator-aurelia-ts

[![Build Status](https://secure.travis-ci.org/kristianmandrup/generator-aurelia-ts.png?branch=master)](https://travis-ci.org/kristianmandrup/generator-aurelia-ts)

Based on [aurelia-typescript](https://github.com/kristianmandrup/aurelia-typescript) forked from [@cmichaelgraham](https://github.com/cmichaelgraham/aurelia-typescript)

### Contributing

As you add features, add [yeoman tests](http://yeoman.io/authoring/testing.html)

Use [npm link](http://justjs.com/posts/npm-link-developing-your-own-npm-modules-without-tears) to install it locally to test it as you develop ;)

Profit!

### Contributors

- [@telekosmos](https://github.com/telekosmos)
- [@kristianmandrup](https://github.com/kristianmandrup)
- You :)

### CSS Frameworks

This generator currently supports:
- [Bootstrap](http://getbootstrap.com) 3.3.x
- [Zurb Foundation](http://foundation.zurb.com/) 5.5.x
- [Semantic UI](semantic-ui.com) 2.0.x
- [Framework7 - F7*](http://www.idangero.us/framework7)

Make a pull request to make the generator support your favorite alternative UI framework.

* - "Experimental" support, please help improve!

### Adding your Favorite Framework to the generator

Example [F7](http://www.idangero.us/framework7):

In `package.json` insert the `"framework7"` as a jspm dependency. Note that it includes the [systemjs/plugin-css](https://github.com/systemjs/plugin-css) at the end, which is the [SystemJS](https://github.com/systemjs/systemjs) CSS loader.

```json
  "jspm": {
    "dependencies": {
      ...
    <% if (cssFramework == 'Framework7') { %>
    "framework7": "github:nolimits4web/Framework7@^1.2.0",
    <% } %>
    "css": "github:systemjs/plugin-css@^0.1.9"
  },
```

Add the [JSPM](jspm.io) imports to `templates/src/app.js`.
JSPM can load css via the [JSPM css loader](https://github.com/geelen/jspm-loader-css)

See the [framework7 distribution folder](https://github.com/nolimits4web/Framework7/tree/master/dist) and use it to guide your ES2015 module imports.

Also check out the [package.json](https://github.com/nolimits4web/Framework7/tree/master/package.json) for the project.

We can see, it has a `main` entry pointing to `dist/js/framework7.js` so we can safely import the js via `import 'framework7';`

The `css` imports needs to reference the `dist` folder structure directly.

```js
<% if (cssFramework == 'Framework7') { %>
import 'framework7';
import 'framework7/css/framework7.ios.css!';
import 'framework7/css/framework7.ios.colors.css!';
<% } %>
```

Finally customize the Application load spinner in `_index.html`

```html
  <% if (cssFramework == 'Bootstrap') %>
  <i class="fa fa-spinner fa-spin"></i>
  <% } %>
```

*Troubleshooting*

If while developing on the generator you get an error such as:

`Uncaught SyntaxError: Unexpected token return`

It is most likely due to an [EJS](http://ejs.co/) template error, and not to do with your javascript.

### TypeScript

Currently uses bindings from [Aurelia Typings](https://github.com/cmichaelgraham/aurelia-typescript-atom/tree/master/skel-nav-ts/typings/aurelia) as of *July 24th, 2015*.

Please submit pull requests for further TypeScript Definition updates...

### Install

To install generator-aurelia-ts from npm, run:

```bash
npm install -g generator-aurelia-ts
```

Initiate the app generator (default):

```bash
yo aurelia-ts
```

- application name
- application title
- github account
- email
- name
- CSS Framework:
  - Bootstrap 3.3.x
  - Foundation 5.5.x
  - Semantic UI 2.0.x
  - Framework7 1.2.x

For Semantic-UI it will reference `/semantic/dist` your semantic build destination folder.

For Semantic UI, you can customize your layout from within the `/semantic` folder. See:
- [Build tools](http://semantic-ui.com/introduction/build-tools.html)
- [Theming](http://semantic-ui.com/usage/theming.html)
- [Recipes](http://semantic-ui.com/introduction/advanced-usage.html)

After setting up the basic project structure, the main generator will ask you to call the `aurelia-ts:typescript` generator.
If you skip TypeScript, know that you can always add TypeScript later using the `typescript` sub-generator.

```bash
yo aurelia-ts:typescript
```

## TODO

Ideas for improvement are welcome :)

## License

MIT
