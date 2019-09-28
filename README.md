`nuxt.config.js` 中添加

```js
plugins: [
  {
    src: '~/plugins/externalComponent',
    // mode: 'client',
  }
]
//......
modules: [
  {
    src: '~/modules/extsModule', options: {
      manifest: path.resolve(path.join(__dirname, './manifest')),
      registry: 'http://vue.d',
      verbose: true,
      // index: 'latest.json',
    }
  }
]
```

