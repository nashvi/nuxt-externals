const self = process.browser ? window : global

self.externalComponent = function (baseUrl, name) {
    if (self[name]) return self[name];

    self[name] = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.async = true;
        script.addEventListener('load', () => {
            resolve(self[name]);
        });
        script.addEventListener('error', () => {
            reject(new Error(`Error loading ${name}`));
        });
        script.src = `${baseUrl}/${name.split('.')[0]}/${name}.umd.min.js`;
        document.head.appendChild(script);
    });

    return self[name]; //.then(m => m.default || m)
}