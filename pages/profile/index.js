$(document).ready(myProfile)

var user, userProfile;

function myProfile() {

    if (!sessionStorage.userData) loadpage('e404')

    user = JSON.parse(sessionStorage.userData)

    userProfile = `
        <img src="${user.photo}" alt="${user.name}" referrerpolicy="no-referrer">
        <h3>${user.name}</h3>
        <ul>
            <li><strong>E-mail:</strong> ${user.email}</li>
            <li><strong>Cadastro:</strong> ${user.created}</li>
            <li><strong>Último login:</strong> ${user.lastLogin}</li>
        </ul>

    `

    $('#userProfile').html(userProfile)

    // Código de profile

}
