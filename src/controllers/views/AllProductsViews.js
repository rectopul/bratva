const Category = require('../../models/Category')
const Product = require('../../models/Product')
const Page = require('../../models/Page')
ProductCategory = require('../../models/ProductCategory')
const { Op } = require('sequelize')

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
                include: { association: `child`, include: { association: `child` } },
            })

            const { category_slug } = req.params

            const products = await Product.findAll({ include: { association: `image`, where: { default: true } } })

            const pages = await Page.findAll()

            const productPage = await Page.findOne({ where: { slug: 'produtos' } })

            return res.render('page-products', {
                pageTitle: `Todos o produtos`,
                categories,
                listProducts: products.map((product) => product.toJSON()),
                pageType: 'site',
                pageClasses: `page-product`,
                pages: pages.map((page) => page.toJSON()),
                content: productPage.toJSON(),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
