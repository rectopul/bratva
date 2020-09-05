const translate = (() => {
    //private var/functions
    const form = document.querySelector('.formEditTranslate')

    const handleForm = (btn) => {
        btn.addEventListener('click', function (e) {
            const id = btn.dataset.id

            const type = form.dataset.type

            if (type === `pages`) form.elements['page_id'].value = id
            if (type === `products`) form.elements['product_id'].value = id
            if (type === `categories`) form.elements['category_id'].value = id

            if (form) form.dataset.id = id
        })
    }

    function store(form) {
        return new Promise((resolve, reject) => {
            const type = form.dataset.type

            const values = util.serialize(form)

            values.type = type

            fetch(`/api/v1/translate`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${document.body.dataset.token}`,
                },
                body: JSON.stringify(values),
            })
                .then((r) => r.json())
                .then((res) => resolve(res))
                .catch((error) => reject(error))
        })
    }

    function handleSubmit() {
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault()

                store(form)
            })
        }
    }

    function init() {
        handleSubmit()
    }

    return {
        //public var/functions
        handleForm,
        init,
    }
})()

translate.init()

const btnOpenFormTranslate = [...document.querySelectorAll('button.editTranslate')]

if (btnOpenFormTranslate) btnOpenFormTranslate.map(translate.handleForm)