$(document).ready(myContacts)

/**
 * Função principal da página "contacts".
 **/
function myContacts() {
    /**
     * Altera o título da página quando 'contacts' for acessada.
     **/
    changeTitle('Faça contato')

    $(document).on('submit', '#cForm', sendContact)

}

function sendContact(ev) {

    var formJSON = {}

    const formData = new FormData(ev.target);

    formData.forEach((value, key) => {
        formJSON[key] = value
    })

    $.post('http://localhost:3000/contacts', formJSON)
    .done((data) => {
        if(data.status == 'success') {
            var feedback = `
                <h3>Olá ${formJSON.name}!</h3>
                <p>Obrigado pelo seu contato...</p>
            `
            $('#cForm').html(feedback)
        }
    })

    return false
}