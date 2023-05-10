// Quando view estiver pronta executa essa função
$(document).ready(myView)

// Função que faz a view ser apresentada em tela
function myView() {

    // Contante que guarda o caminho da sessão do navegador que guarda o id do artigo clicado
    const articleId = parseInt(sessionStorage.article)

    // Verifica se o Id armazenado na sessão é um número e caso não seja, a pagina 404 é carregada
    if (isNaN(articleId)) loadpage('e404')

    // Caso o Id seja um número, monta o endereço para buscar o artigo pelo ID
    // o comando .get é uma promessa podendo resultar em verdadeiro, falso ou sempre nesse caso em questão verdadeiro e falso (done ou fail)
    // get executa uma busca de dados e dentro de seus pareteses está o caminho dessa busca
    /**
     * app.apiBaseURL é o endreço do sistema que está guardado no objeto app localizada na index.js principal no atributo apiBaseURL
     * articles é o nome da coleção de artigos no banco de dados
     * id é uma propriedade que recebe o dado armazenado na sessão de navegação na qual o caminho está armazenada na constante articleId
     * status é uma propriedade que recebe o dado 'on'
     **/ 

    $.get(app.apiBaseURL + 'articles', { id: articleId, status: 'on' })

     // Havendo resultado , os dados da pesquisa são guardandos na variaval data
        .done((data) => {
            // A busca deve resultar em 1 unico artigo , caso apresente mais ou menos  que 1 artigo é apresentado a pagina de erro
            if (data.length != 1) loadpage('e404')

            // Guarda os dados do unico artigo, data [0] em artData
            artData = data[0]

            // Adiciona os dados de título do artigo, que estão armazenados na variavel title do objeto artData no inner html artTitle
            $('#artTitle').html(artData.title)

            // Adiciona os dados de texto do artigo, que estão armazenados na variavel artData.content no inner html artContent
            $('#artContent').html(artData.content)

            // Função que atualiza o numero de visualizações do artigo - paremetro entre parenteses é o objeto artData
            updateViews(artData)

            // função que atualiza o titulo da página localizada na index.js principal - paremetro entre parenteses é o atributo title do objeto artData
            changeTitle(artData.title)
            
            // função que busca o autor do artigo - paremetro entre parenteses é o objeto artData
            getAuthorData(artData)

            // função que busca os artigos do autor do artigo selecionado acima - paremetro entre parenteses é o objeto artData + a quantidade máxima de artigos a buscar, aqui é o máximo de 5 - 
            getAuthorArticles(artData, 5)

            // função que buscar os autodos dos comentários do artigo - paremetro entre parenteses é o objeto artData
            getUserCommentForm(artData)

            // função que busca os comentários do artigo - paremetro entre parenteses é o objeto artData + a quantidade máxima de comentários a buscar - aqui é o máximo 999 
            getArticleComments(artData, 999)
        })
        // Não havendo resultado ou excedendo o tempo de espera.
        .fail((error) => {
             
            // apresenta um popup informando que o artigo não foi localizado. 
            popUp({ type: 'error', text: 'Artigo não encontrado!' }),

            // apresenta a página 404 em seguida
            loadpage('e404')
        })

}

// função que busca o autor do artigo - paremetro entre parenteses é o objeto artData    
function getAuthorData(artData) {
    /**
     * Montando o endereço para buscar o autor
     * app.apiBaseURL é o endreço do sistema que está guardado no objeto app localizada na index.js principal no atributo apiBaseURL
     * users é o nome da coleção de usuarios no banco de dados
     * artData.author é a id do author a ser localizado.
     **/ 
    $.get(app.apiBaseURL + 'users/' + artData.author)

        // Havendo resultado , os dados da pesquisa são guardandos na variaval userData
        .done((userData) => {

            // Variavel do tipo string
            var socialList = ''

            // Se a quantidade de redes sociais cadastradas para o usuario for maior que zero
            if (Object.keys(userData.social).length > 0) {

                // Inicia a montagem da texto que irá para o inner html 
                socialList = '<ul class="social-list">'

                // Looping que adiciona ao texto acima cada uma das redes sociais localizadas junto ao escopo html paraformar o inner html que será utilizado  
                for (const social in userData.social) {
                    // Adicionando o endereço da rede social ao href e o nome da rede social o inner html da tag a
                    socialList += `<li><a href="${userData.social[social]}" target="_blank">${social}</a></li>`
                }
                //finaliza a montagem do texto para o inner html
                socialList += '</ul>'
            }

            // Inclui os dados dos parenteses posterior ao .html ao escopo da tag de id artMetadata da index.html da pasta view
            /**
             * userData.name é o atributo name do objeto userData
             * myDate.sysToBr(artData.date) transforma a data vinda do banco de dados pelo atributo date do objeto artData em data no formato Brasileiro.
             */
            $('#artMetadata').html(`<span>Por ${userData.name}</span><span>em ${myDate.sysToBr(artData.date)}.</span>`)
            // Inclui os dados dos parenteses posterior ao .html ao escopo da tag de id artAuthor da index.html da pasta view
            /**
             * userData.photo é o atributo foto do objeto userData
             * userData.name é o atributo name do objeto userData
             * getAge(userData.birth) função que calcula a idade do autor - O parametro entre pareteses é o atributo birth do objeto userData
             * userData.bio é o atributo bio do objeto userData - biografia do autor
             * socialList é a variável que contem o texto das redes sociais montados anteriormente
             */
            $('#artAuthor').html(`
                <img src="${userData.photo}" alt="${userData.name}">
                <h3>${userData.name}</h3>
                <h5>${getAge(userData.birth)} anos</h5>
                <p>${userData.bio}</p>
                ${socialList}
            `)
        })

        // Não havendo resultado ou excedendo o tempo de espera.
        .fail((error) => {
            // apresenta um erro no console
            console.error(error)

            // apresenta a página 404 
            loadpage('e404')
        })
}
// função que busca os artigos do autor do artigo selecionado acima - paremetro entre parenteses é o objeto artData + a quantidade máxima de artigos a buscar, aqui é o máximo de 5 -
function getAuthorArticles(artData, limit) {

    

    $.get(app.apiBaseURL + 'articles', {
        author: artData.author,
        status: 'on',
        id_ne: artData.id,
        _limit: limit
    })
        .done((artsData) => {
            if (artsData.length > 0) {
                var output = '<h3><i class="fa-solid fa-plus fa-fw"></i> Artigos</h3><ul>'
                var rndData = artsData.sort(() => Math.random() - 0.5)
                rndData.forEach((artItem) => {
                    output += `<li class="art-item" data-id="${artItem.id}">${artItem.title}</li>`
                });
                output += '</ul>'
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
 // função que busca os comentários do artigo - paremetro entre parenteses é o objeto artData + a quantidade máxima de comentários a buscar - aqui é o máximo 999
function getArticleComments(artData, limit) {

    var commentList = ''

    $.get(app.apiBaseURL + 'comments', {
        article: artData.id,
        status: 'on',
        _sort: 'date',
        _order: 'desc',
        _limit: limit
    })
        .done((cmtData) => {
            if (cmtData.length > 0) {
                cmtData.forEach((cmt) => {
                    var content = cmt.content.split("\n").join("<br>")
                    commentList += `
                        <div class="cmtBox">
                            <div class="cmtMetadata">
                                <img src="${cmt.photo}" alt="${cmt.name}" referrerpolicy="no-referrer">
                                <div class="cmtMetatexts">
                                    <span>Por ${cmt.name}</span><span>em ${myDate.sysToBr(cmt.date)}.</span>
                                </div>
                            </div>
                            <div class="cmtContent">${content}</div>
                        </div>
                    `
                })
            } else {
                commentList = '<p class="center">Nenhum comentário!<br>Seja o primeiro a comentar...</p>'
            }
            $('#commentList').html(commentList)
        })

        // Não havendo resultado ou excedendo o tempo de espera.
        .fail((error) => {
            // apresenta um erro no console
            console.error(error)
            // apresenta a página 404 
            loadpage('e404')
        })

}
 // função que buscar os autodos dos comentários do artigo - paremetro entre parenteses é o objeto artData
function getUserCommentForm(artData) {

    var cmtForm = ''

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            cmtForm = `
                <div class="cmtUser">Comentando como <em>${user.displayName}</em>:</div>
                <form method="post" id="formComment" name="formComment">
                    <textarea name="txtContent" id="txtContent">Comentário fake para testes</textarea>
                    <button type="submit">Enviar</button>
                </form>
            `
            $('#commentForm').html(cmtForm)
            $('#formComment').submit((event) => {
                sendComment(event, artData, user)
            })
        } else {
            cmtForm = `<p class="center"><a href="login">Logue-se</a> para comentar.</p>`
            $('#commentForm').html(cmtForm)
        }
    })

}

function sendComment(event, artData, userData) {

    event.preventDefault()
    var content = stripHtml($('#txtContent').val().trim())
    $('#txtContent').val(content)
    if (content == '') return false

    const today = new Date()
    sysdate = today.toISOString().replace('T', ' ').split('.')[0]

    $.get(app.apiBaseURL + 'comments', {
        uid: userData.uid,
        content: content,
        article: artData.id
    })
        .done((data) => {
            if (data.length > 0) {
                popUp({ type: 'error', text: 'Ooops! Este comentário já foi enviado antes...' })
                return false
            } else {

                const formData = {
                    name: userData.displayName,
                    photo: userData.photoURL,
                    email: userData.email,
                    uid: userData.uid,
                    article: artData.id,
                    content: content,
                    date: sysdate,
                    status: 'on'
                }

                $.post(app.apiBaseURL + 'comments', formData)
                    .done((data) => {
                        if (data.id > 0) {
                            popUp({ type: 'success', text: 'Seu comentário foi enviado com sucesso!' })
                            loadpage('view')
                        }
                    })
                    // Não havendo resultado ou excedendo o tempo de espera.
                    .fail((err) => {
                        // apresenta um erro no console
                        console.error(err)
                    })

            }
        })

}

// Função que atualiza o numero de visualizações do artigo - paremetro entre parenteses é o objeto artData
function updateViews(artData) {
    // Função jquery que efetua um acesso ao banco de dados json
    $.ajax({

        // Tipo de método de acesso ao banco de dados que efetua a atualização de um dado do banco sem alterar os demais 
        type: 'PATCH',
        // Caminho para acessar o banco de dados  
        url: app.apiBaseURL + 'articles/' + artData.id,
        // Atualiza a quantidade de visualizaçãos do artigo 
        data: { views: parseInt(artData.views) + 1 }
    });
}