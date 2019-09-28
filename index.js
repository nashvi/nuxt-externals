function matchRegexp(o) {
    const no = []
    Object.keys(o).forEach(k => {
        const nk = new RegExp(k)
        no.push([
            nk, o[k]
        ])
    })
    return (pattern, ...rest) => {
        for (let [r, cb] of no) {
            let m = pattern.match(r)
            if (m) {
                return cb(pattern, m, ...rest)
            }
        }
    }
}

function mkProjExts(matchlist, externalModules) {
    const matcher = matchRegexp(matchlist)
    return name => {
        if (['vue', 'vuex', 'vue-router'].includes(name)) {
            return
        } else if (name in externalModules) {
            console.log(`[used] ${name}`)
            return `${name}.${externalModules[name]}`
        } else {
            let comp = matcher(name)
            if (comp) {
                if (comp in externalModules) {
                    console.log(`[used] ${name} --> ${comp}`)
                    return `${comp}.${externalModules[comp]}`
                } else {
                    console.log(`[matched] ${name} --> ${comp}`)
                    return comp
                }
            } else {
                return
            }
        }
    }
}

function mkImport(registry, loader) {
    return (name, ori, reg, ld) => {
        let rv = `() => ${ld || loader}('${reg || registry}','${name}')`
        console.log('[importStmt] ', rv)
        return rv
    }
}

import Axios from 'axios'
import path from 'path'
export default async function extsModule({ manifest, registry, index, verbose }) {
    console.log(`[info] register plugin externalComponent`)
    this.addPlugin(path.resolve(__dirname, 'lib', 'externalComponent.js'))

    const externalModules = registry ? (await Axios.get(`${registry}/${index || 'latest.json'}`)).data : {}
    if (verbose) Object.keys(externalModules).forEach(k => {
        console.log(`${k} ==> ${externalModules[k]}`)
    })
    const projExts = mkProjExts(require(manifest), externalModules)
    const impStmt = mkImport(registry, 'externalComponent')
    this.extendBuild((config, { isClient, isServer }) => {
        if (isClient) {
            config.externals = (context, request, callback) => {
                let r = projExts(request)
                if (r) {
                    callback(null, impStmt(r, request))
                } else {
                    callback()
                }
            }
        } else {
            const nodeExtrenals = require('webpack-node-externals')
            config.externals = nodeExtrenals({
                whitelist: /\.css$/
            })
        }
    })
}
