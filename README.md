A simple admin panel that integrates into existing Node + Express + MySQL/MariaDB applications.

Used by [Ptorx](https://ptorx.com) and other [Xyfir](https://xyfir.com/) projects.

# Features

- View databases on provided MySQL/MariaDB server
- View tables within a database
- View a table's structure
- View, edit, insert, and remove rows within a table
- Ability to write, run, and see the results of your own custom SQL queries

This panel is currently very simple and limited in what it is able to do. Feel free to implement new features as you need them and create a pull request.

# Setup

**WARNING!** Some setup is required. This is not a standalone admin panel that you install and run a couple commands. It was built to integrate directly into your existing application so as to give you more control over it. How you integrate it into your existing Express + MySQL application is largely up to you.

The following setup guide should be used as a rough example of how to implement it. Things can vary greatly depending on your exact stack and environment.

## Server

```js
const express = require('express');
const admyn = require('admyn/server');

const app = express();

// ... all your express middleware and initialization

app.use(
  // Use whatever base route you want
  '/admyn',
  // Validate that the user is authorized for action
  function(req, res, next) {
    // ... some code to check if user is an admin
    if (!isUserAdmin) return res.status(403).send();

    req.admyn = {
      // This gives you the ability to specify each admin's database access
      database: {
        port: 3306,
        host: 'localhost',
        user: 'root',
        password: ''
      };
    }

    next();
  },
  admyn()
);
```

## Client

Integrating the client is much less straightforward and is almost entirely up to you to figure out how to add it to your application's build process.

### Step 1

To integrate and configure the admin panel, it's highly recommended to give the admin panel it's own unique page and React application and not import it as a component into your normal React application (if you have one).

**Admin.jsx**
```jsx
import AdminPanel from 'admyn/client';
import { render } from 'react-dom';
import React from 'react';

render(
  // title= the title that shows in the panel's toolbar
  // api= the base API route to access the Admyn API
  <AdminPanel title='Admyn' api='/admyn/' />,
  // element to render component to
  document.getElementById('admyn')
);
```

### Step 2

### Defaults

If you just want the CSS for the admin panel and don't want to add any customizations you need to somehow import the CSS file found at `node_modules/admyn/client/styles/admyn.css`.

### Customization

If you want to customize the admin panel you'll need to create a `.SCSS` file to import the needed styles and then add any custom styles you want.

**admin.scss**
```scss
/*
  react-md is used by Admyn and should be installed if you have Admyn
  installed.
*/
@import 'node_modules/react-md/src/scss/_react-md.scss';

@import 'node_modules/admyn/client/styles/styles.scss';

/* Set the colors / vars for the panel. Check react-md docs. */
$md-primary-color: $md-purple-800;
$md-secondary-color: $md-indigo-500;

/* Leave this at the bottom unless you want to overwrite react-md styles */
@include react-md-everything;
```

### Step 3

Next you'll need an HTML file to pull everything together.

**Admin.html**
```html
<html>
<head>
  <!-- All of these are required by admin panel. Import them however you wish. -->
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="/path/to/admin.css">
</head>
<body>
  <main id="admyn"></main>
  <script src="/path/to/Admin.js"></script>
</body>
</html>
```

### Step 4

The admin panel JS/JSX will now need to be bundled, transpiled, etc. We'll use Gulp + Browserify + Babel for this example. This of course can be done with Webpack + Babel or whatever combination of build tools your application is already using.

**gulpfile.js**
```js
gulp.task('build-admin-js', () => {
  const browserify = require('browserify');
  const babelify = require('babelify');
  const source = require('vinyl-source-stream');

  const extensions = ['.jsx', '.js'];
  
  return browserify(
    `./path/to/Admin.jsx`, { debug: true, extensions }
  )
  .transform(
    babelify.configure({ extensions, presets: ['env', 'react'] })
  )
  .bundle()
  .pipe(source(`Admin.js`))
  .pipe(gulp.dest('./path/to/compiled/js/'));
});
```

### Step 5

Finally, you'll need to convert the SCSS to CSS. We'll use Gulp again, with gulp-sass. If you're using the default pre-built CSS file on its own you can skip this step.

**gulpfile.js**
```js
gulp.task('build-admin-css', () => {
  const sass = require('gulp-sass');
  
  return gulp
    .src(`./path/to/admin.scss`)
    .pipe(sass({ outputStyle: 'compressed' })
    .on('error', sass.logError))
    .pipe(gulp.dest('./path/to/compiled/css'));
});
```
