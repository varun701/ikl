import Keyv from 'keyv'

const keyv = new Keyv('sqlite://database/keyv.sqlite')

keyv.on('err', (err) => console.log(err))

export default keyv
