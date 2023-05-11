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
        author: artData.author,
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
 // função que busca os comentários do artigo - paremetro entre parenteses é o objeto artData + a quantidade máxima de comentários a buscar - aqui é o máximo 999
function getArticleComments(artData, limit) {

    // Variavel que recebe uma string que será utilizado em um inner html
    var commentList = ''
    /**
     * Montando o endereço para buscar os comentários do artigo
     * app.apiBaseURL é o endreço do sistema que está guardado no objeto app localizada na index.js principal no atributo apiBaseURL
     * comments é o nome da coleção de comentários no banco de dados
     * artData.id é o id do artigo que esta sendo aberto e está sendo adicionado na propriedade article
     * on é a status que os artigos precisam estar, esta sendo colocada na propriedade status.
     * date é a data do comentário e é adicionado ao parametro _sort
     * desc é a ordem que deve ser apresentada. do mais novo para o mais antigo adicionando a propriedade _order      
     * limit é a quantidade de comentários que serão carregados, nesse caso é 999, esta sendo colocada na propriedade _limit.
     **/ 

    $.get(app.apiBaseURL + 'comments', {
        article: artData.id,
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
                    /**
                     * Adicionando o texto que irá para o inner html
                     * cmt.photo é a foto do usuário que efetuou o comentário
                     * cmt.name é o nome do usuario que efetuou o comentário
                     * myDate.sysToBr(cmt.date) converte a data (cmt.date) que é a data do comentário na data no modelo do brasil
                     * content é o comentário
                     */
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
                // Se o número de comentários for zero é adicionado na variavel commentList o texto Nenhum comentário!<br>Seja o primeiro a comentar...
            } else {
                commentList = '<p class="center">Nenhum comentário!<br>Seja o primeiro a comentar...</p>'
            }
            // Adiciona o conteudo de commentList no inner html da tag de id commentList
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

    // Variavel que recebe uma string que será utilizado em um inner html
    var cmtForm = ''

    //observador que informa ao firebase alterações de login e logout
    firebase.auth().onAuthStateChanged((user) => {

        // Se usuário existir logado
        if (user) {
            // Adiciona na variavel cmtForm
            //user.displayName é o nome do usuário que está fazendo o comentário
            cmtForm = `
                <div class="cmtUser">Comentando como <em>${user.displayName}</em>:</div>
                <form method="post" id="formComment" name="formComment">
                    <textarea name="txtContent" id="txtContent">Comentário fake para testes</textarea>
                    <button type="submit">Enviar</button>
                </form>
            `
            // Adiciona os dados de cmtForm na inner html da tag de id commentForm da index.html da pasta view
            $('#commentForm').html(cmtForm)

            // Botão que submete o formulario para o banco de dados
            $('#formComment').submit((event) => {
                //função que guarda o comentário no banco
                // event, artData, user são os dados que serão enviados ao banco de dados 
                sendComment(event, artData, user)
            })
            // Se não existir usuário logado
        } else {
            // Substitue os dados da variavel cmtForm pela informação abaixo
            cmtForm = `<p class="center"><a href="login">Logue-se</a> para comentar.</p>`

            //adiciona os dados de cmtForm na inner html da tag de id commentForm da index.html da pasta view
            $('#commentForm').html(cmtForm)
        }
    })

}

//função que guarda o comentário no banco
// event, artData, user são os dados que serão enviados ao banco de dados 
function sendComment(event, artData, userData) {

    // Método do objeto event que previne o envio de comentários vazinos 
    event.preventDefault()
    // Variavel que recebe o texto do comentário sem espaços no inicio e no fim
    var content = stripHtml($('#txtContent').val().trim())
    // Adiciona o valor do comentario na no inner html de id txtContent
    $('#txtContent').val(content)
    // Caso o comentário esteja vazio não envia nada ao banco de dados 
    if (content == '') return false

    // Constante que guarda uma data
    const today = new Date()
    // guarda a data do sistema retirando o horário  
    sysdate = today.toISOString().replace('T', ' ').split('.')[0]

    /**
     * Montando o endereço para buscar os comentários do artigo
     * app.apiBaseURL é o endreço do sistema que está guardado no objeto app localizada na index.js principal no atributo apiBaseURL
     * comments é o nome da coleção de comentários no banco de dados
     * userData.uid é o id do usuário que esta comentando, esta sendo colocada na propriedade uid
     * content é o comentário, esta sendo colocado na propriedade content
     * artData.id é o id do artigo que esta sendo aberto e está sendo adicionado na propriedade article
     **/ 
    $.get(app.apiBaseURL + 'comments', {
        uid: userData.uid,
        content: content,
        article: artData.id
    })
        // Havendo resultado , os dados da pesquisa são guardandos na variaval data
        .done((data) => {
            // se o numero de dados for maior que 0 
            if (data.length > 0) {
                // popup  de erro 
                popUp({ type: 'error', text: 'Ooops! Este comentário já foi enviado antes...' })
                // retorna false
                return false
            } 
            
            // se o numero de dados for 0
            else {

                //constante que guarda todos os dados do comentario
                /**
                 * name: userData.displayName - nome do usuario que comentou
                    photo: userData.photoURL - foto de quem comentou
                    email: userData.email - email do usuario que comentou
                    uid: userData.uid - id do usuario que comentou
                    article: artData.id - id do artigo que recebeu o comentário
                    content: content - comentário do usuario
                    date: sysdate - data do sistema no momento do comentário
                    status: 'on' - status deve ser on
                 */
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
                // Guarda o comentário no banco de dados 
                $.post(app.apiBaseURL + 'comments', formData)

                    // Havendo resultado , os dados da pesquisa são guardandos na variaval data 
                    .done((data) => {
                        // Se o atributo id do objeto data for diferente de zero, executa if
                        if (data.id > 0) {
                            // Popup que informa que "Seu comentário foi enviado com sucesso!"
                            popUp({ type: 'success', text: 'Seu comentário foi enviado com sucesso!' })

                            // Carrega a página com os arquivos da pasta view 
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