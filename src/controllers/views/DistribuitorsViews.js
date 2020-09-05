const Category = require('../../models/Category')
const { Op } = require('sequelize')
const Page = require('../../models/Page')
const Partner = require('../../models/Partner')
const Contact = require('../../models/Contact')
const partialTranslations = require('../../modules/translate')

module.exports = {
    async view(req, res) {
        try {
            const { lang: language } = req.query
            const categories = await Category.findAll({
                where: {
                    parent: {
                        [Op.eq]: null,
                    },
                    slug: {
                        [Op.not]: `oculto`,
                    },
                },
                order: [['position', 'ASC']],
                include: {
                    association: `child`,
                    order: [['position', 'ASC']],
                    include: { association: `child`, order: [['position', 'ASC']] },
                },
            })

            const home = await Page.findOne({ where: { slug: 'home' } })

            const partners = await Partner.findAll({ order: [['position', 'ASC']] })

            const contacts = await Contact.findAll()

            return res.render('distributors', {
                pageTitle: `Distribuidores`,
                categories,
                pageType: `site`,
                messagesCount: contacts.length,
                messages: contacts.map((cliente) => {
                    const client = cliente.toJSON()
                    const { createdAt, fullname } = client

                    const [name, surname] = fullname.split(' ')

                    const data = new Intl.DateTimeFormat('pt-BR').format(createdAt)

                    client.date = data
                    client.name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

                    return client
                }),
                home: home.toJSON(),
                partners: partners.map((partner) => partner.toJSON()),
                partials: partialTranslations(language),
            })
        } catch (error) {
            return res.redirect('/404')
        }
    },
}
