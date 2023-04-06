$(document).ready(myApp)

function myApp(){

    // Carrega a página inicial.
    loadpage('home')

}
// Carrega uma página.
function loadpage(page) {

    // Monta os caminhos para os componentes da página solicitada.
    const path = {
        html: `/pages/${page}/index.html`,
        css: `/pages/${page}/index.css`,
        js: `/pages/${page}/index.js`,
    }
    $.get(path.html)
    .done((data)=>{
        $('main').html(data)

    })
    .fail((error)=>{
        loadpage('e404')
    })

}