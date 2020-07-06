const Code = require('../models/Code')
const Search = require('../models/Search')
const log = require('debug')('api:main')
const userByToken = require('../middlewares/userByToken')
const sequelize = require('sequelize')
const moment = require('moment')

const adjustDate = (dateString) => {
    const sortRes = dateString.sort((a, b) => {
        return a.month < b.month ? -1 : a.month > b.month ? 1 : 0
    })

    const momment = sortRes.map((r) => {
        let correctDate = new Date(r.month)
        correctDate = correctDate.setHours(correctDate.getHours() + 3)
        r.month = new Date(correctDate)
        return r
    })

    return momment
}

module.exports = {
    async store(req, res) {
        try {
            const { name, surname, email, code, ip, city, region } = req.body
            let oldDevice = req.headers['user-agent']

            const size = oldDevice.indexOf(')') - oldDevice.indexOf('(')

            let device = oldDevice.substr(oldDevice.indexOf('(') + 1, size - 1)

            //consult code
            const search = await Code.findOne({
                where: { code },
                include: [{ association: `item` }, { association: `product` }],
            })

            if (!search) return res.status(400).send({ error: `Código não existe` })

            if (!name) return res.status(400).send({ error: `Please enter your name` })
            if (!surname) return res.status(400).send({ error: `Please enter your surname` })
            if (!email) return res.status(400).send({ error: `Please enter your mail` })

            //insert search in data-base

            const insertCode = await Search.create({
                name,
                surname,
                email,
                code_id: search.id,
                ip,
                city,
                device,
                address: region,
            })
            //code
            const response = await Search.findByPk(insertCode.id, {
                include: { association: `code`, include: [{ association: `item` }, { association: `product` }] },
            })

            return res.json(response)
        } catch (error) {
            log(`Erro ao realizar consulta de código: `, error.message)
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
    async index(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { user_id } = await userByToken(authHeader)

            const countByMonth = await Search.findAll({
                attributes: [
                    [sequelize.fn('date_trunc', 'month', sequelize.col('created_at')), 'month'],
                    [sequelize.fn('count', '*'), 'count'],
                ],
                group: 'month',
            })

            let jsonData = countByMonth.map((date) => date.toJSON())

            jsonData = adjustDate(jsonData)

            jsonData = jsonData.map((newDate) => {
                newDate.month = moment(newDate.month).format('MMM')
                return newDate
            })

            return res.json(jsonData)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo produto: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
