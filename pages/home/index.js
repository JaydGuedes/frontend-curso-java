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
        
        var articleListMaisVistos = '';

    $.get(app.apiBaseURL + 'articles', {
        _sort: 'date',
        _order: 'desc',
        status: 'on'
    })
        .done((data) => {
            data.forEach((art) => {
                articleListMaisVistos += `
                    <div class="aa" data-id="${art.id}">
                        <div>
                            <h3>${art.title}</h3>
                        </div>
                    </div>                    
                `
            })
            $('#artMaisVis').html(articleListMaisVistos)
        })
        .fail((error) => {
            $('#artList').html('<p class="center">Oooops! Não encontramos nenhum artigo...</p>')
        })

}


// testando

function getAuthorArticles(artData, limit) {

    /**
     * Montando o endereço para buscar os artigos do autor
     * app.apiBaseURL é o endreço do sistema que está guardado no objeto app localizada na index.js principal no atributo apiBaseURL
     * articles é o nome da coleção de usuarios no banco de dados
     * artData.author é a id do author para localizar os artigos, esta sendo colocada na propriedade author
     * on é a status que os artigos precisam estar, esta sendo colocada na propriedade status.
     * artData.id é a id artigo que esta sendo aberto para que seja feita a busca com excessão do mesmo, esta sendo colocada na propriedade id_ne.
     * limit é a quantidade de artigos que serão carregados, nesse caso é 5, esta sendo colocada na propriedade _limit.
     **/ 
    $.get(app.apiBaseURL + 'articles', {
        status: 'on',
        id_ne: artData.id,
        _limit: limit
    })

        // Havendo resultado , os dados da pesquisa são guardandos na variaval artsData
        .done((artsData) => {

            // Se a quantidade de artigos cadastrados do autor for maior que zero
            if (artsData.length > 0) {

                // Variavel de string que será utilizada como inner html
                var output = '<h3><i class="fa-solid fa-plus fa-fw"></i> Artigos</h3><ul>'
                /**
                 * Variavel que armazena osartigos do altor de forma aleatória para que não apareçam sempre da mesma maneira
                 * A função Math.random() pega os resultados e embaralha ele
                 */
                var rndData = artsData.sort(() => Math.random() - 0.5)
                rndData.forEach((artItem) => {
                    // Adiciona a variavel output a lista  com o id do artigo e o titulo do artigo
                    output += `<li class="art-item" data-id="${artItem.id}">${artItem.title}</li>`
                });
                // Finaliza a variavel 
                output += '</ul>'
                // Adiciona na tag de id authorArtcicles os dados da variavel output
                $('#authorArtcicles').html(output)
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
/**
 * Exercício Incremente o aplicativo de forma que, uma vez na página inicial (rota "home"),
 * na barra lateral, apareçam os 5 (cinco) artigos mais visualizados do site em uma lista chamada "+ Vistos".
 * Ainda nessa página, implemente também, na barra lateral, uma lista "Comentários", listando os 5 (cinco)
 * comentários mais recentes, independente de artigo.
 */

// + Vistos 5
// Comentários 5






