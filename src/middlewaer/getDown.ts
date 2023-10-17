import axios from 'axios'
const root = process.cwd()
var config = require(root + '/config.json')

export default async function (id: string): Promise<{
    name: string
    link: string
}> {
    return new Promise(async (resolve, reject) => {
        axios
            .get(config.download + id, {})
            .then(async (res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
