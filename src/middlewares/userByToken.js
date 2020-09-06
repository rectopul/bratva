/* eslint-disable no-async-promise-executor */
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Client = require('../models/Client')

module.exports = async (authHeader) => {
    return new Promise(async (resolve, reject) => {
        let decoded

        if (!authHeader)
            return reject({
                name: `userToken`,
                message: `No token provided`,
            })

        const [, token] = authHeader.split(' ')

        if (!token) {
            console.log(`error aqui`)
            return reject({
                name: `userToken`,
                message: `No token provided`,
            })
        }

        try {
            decoded = jwt.verify(token, process.env.APP_SECRET)
        } catch (error) {
            console.log(error)
            return reject(error)
        }

        const { id, name } = decoded

        // Fetch the user by id
        const UserExist = await User.findOne({ where: { id, name } })

        if (!UserExist) {
            return reject({
                name: `userToken`,
                message: `User informed by token not exists`,
            })
        } else return resolve({ user_id: UserExist.id })
    })
}
