```bash
npm -D i git+https://github.com/murphil/nuxt-externals.git
```

`nuxt.config.js` 中添加

```js
modules: [
  {
    src: 'nuxt-externals', options: {
      manifest: path.resolve(path.join(__dirname, './manifest')),
      registry: 'http://vue.d',
      verbose: true
      /*
      index: 'latest.json',
      */
    }
  }
]
```

