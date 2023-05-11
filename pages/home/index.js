$(document).ready(myHome)

/**
 * IMPORTANTE!
 * URL para obter todos os artigos ordenados pela data e com status ativo:
 * http://localhost:3000/articles?_sort=date&_order=desc&status=on
 * \---------+---------/
 *           |
 *           +--> URL da API → variável 'app.apiBaseURL' em '/index.js'
 **/

/**
 * Função principal da página "home".
 **/
function myHome() {

    changeTitle()

    var articleList = '';

    $.get(app.apiBaseURL + 'articles', {
        _sort: 'date',
        _order: 'desc',
        status: 'on'
    })
        .done((data) => {
            data.forEach((art) => {
                articleList += `
                    <div class="art-item" data-id="${art.id}">
                        <img src="${art.thumbnail}" alt="${art.title}">
                        <div>
                            <h3>${art.title}</h3>
                            <p>${art.resume}</p>
                        </div>
                    </div>                    
                `
            })
            $('#artList').html(articleList)
        })
        .fail((error) => {
            $('#artList').html('<p class="center">Oooops! Não encontramos nenhum artigo...</p>')
        })

        // + Vistos 5
        //<div id="artMaisVis"></div>
        //<h3>Comentários</h3>
        //<div id="ultimosComents"></div>
        
        getArticlesMView(5);
        getCommentsN(5);

}
/**
 * Exercício Incremente o aplicativo de forma que, uma vez na página inicial (rota "home"),
 * na barra lateral, apareçam os 5 (cinco) artigos mais visualizados do site em uma lista chamada "+ Vistos".
 * Ainda nessa página, implemente também, na barra lateral, uma lista "Comentários", listando os 5 (cinco)
 * comentários mais recentes, independente de artigo.
 */

function getArticlesMView(limit) {

    var saida = ''
    $.get(app.apiBaseURL + 'articles', {
        status: 'on',
        _sort: 'views',
        _order: 'desc',
        _limit: limit
    })

        // Havendo resultado , os dados da pesquisa são guardandos na variaval artsData
        .done((Data) => {

            // Se a quantidade de artigos cadastrados do autor for maior que zero
            if (Data.length > 0) {

                var saida = '<ul>'
                
                Data.forEach((artItem) => {
                    // Adiciona a variavel output a lista  com o id do artigo e o titulo do artigo
                    saida += `<li class="maisV" data-id="${artItem.id}">${artItem.title}</li>`
                });
                // Finaliza a variavel 
                saida += '</ul>'
                // Adiciona na tag de id authorArtcicles os dados da variavel output
                $('#artMaisVis').html(saida)
            }
        })
        // Não havendo resultado ou excedendo o tempo de espera.
        .fail((error) => {
            // apresenta um erro no console
            console.error(error)
            // apresenta a página 404 
            loadpage('e404')
        })

}

function getCommentsN(limit) {

    // Variavel que recebe uma string que será utilizado em um inner html
    var ultimosComents = ''

    $.get(app.apiBaseURL + 'comments', {
        status: 'on',
        _sort: 'date',
        _order: 'desc',
        _limit: limit
    })
        // Havendo resultado , os dados da pesquisa são guardandos na variaval cmtData
        .done((cmtData) => {
            // se o numero de comentários for maior que 0 
            if (cmtData.length > 0) {
                // A função forEach percorre o objeto cmtData e adiciona no objeto cmt
                cmtData.forEach((cmt) => {
                    // variavel que guarda cada comentário incluindo as quebras de linha que foram efetuadas pelo usuário que comentou
                    var content = cmt.content.split("\n").join("<br>")   
                    ultimosComents += `
                                <div class="cmtTexts">
                                    <span>Por ${cmt.name}</span><span>em ${myDate.sysToBr(cmt.date)}.</span>
                                </div>
                            <div class="cmtContent">${content}</div>
                    `
                })
                // Se o número de comentários for zero é adicionado na variavel commentList o texto Nenhum comentário!<br>Seja o primeiro a comentar...
            } else {
                ultimosComents = '<p class="center">Nenhum comentário!</p>'
            }
            // Adiciona o conteudo de commentList no inner html da tag de id commentList
            $('#ultimosComents').html(ultimosComents)
        })

        // Não havendo resultado ou excedendo o tempo de espera.
        .fail((error) => {
            // apresenta um erro no console
            console.error(error)
            // apresenta a página 404 
            loadpage('e404')
        })

}





