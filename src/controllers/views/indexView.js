const Category = require('../../models/Category')
const { Op } = require('sequelize')
const Page = require('../../models/Page')
const Carousel = require('../../models/Carousel')

module.exports = {
    async view(req, res) {
        try {
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

            const home = await Page.findOne({
                where: { slug: 'home' },
                include: { association: `banner`, include: { association: `image` } },
            })

            const carousel = await Carousel.findAll({ include: { association: `image` } })

            return res.render('index', {
                pageTitle: `Bratva`,
                categories,
                banners: carousel.map((carr) => {
                    return carr.toJSON()
                }),
                bannerPape: home.toJSON().banner.image,
                home: home.toJSON(),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/dashboard')
        }
    },
}
