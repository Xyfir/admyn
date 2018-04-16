# Setup

Assuming you've cloned this repo.

```bash
cd admyn
npm install
npm run build:example
node example/server
```

Then in your browser navigate to http://localhost:2063

# Testing Changes

If you want to make changes to the admyn server or client and see those changes reflected in the example, make sure you build the admyn files before building the example files.

```bash
npm run build:library:js
# or
npm run build:library:css
# or
npm run build:library
# and then...
npm run build:example:js
# or
npm run build:example:css
# or
npm run build:example
```
