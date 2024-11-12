const clientId = '1fd64948cbdd44d29396ce9aca70ee5d';
const redirectUri = 'https://igoryanko.github.io/Spotify-Genius/callback.html';
const scopes = 'user-read-private user-read-email';
const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&show_dialog=true`;


function redirectToSpotifyAuth() {
    window.location.href = authUrl;
}

function getAuthorizationCode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
}

async function exchangeCodeForToken(authorizationCode) {
    const clientSecret = 'your-client-secret';
            
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: authorizationCode,
            redirect_uri: redirectUri
        })
    });

    const data = await response.json();
    if (data.access_token) {
        localStorage.setItem('spotifyAccessToken', data.access_token);
    }
    return data.access_token;
}

async function getUserId(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    const data = await response.json();
    if (data.id) {
        localStorage.setItem('spotifyUserId', data.id);
    }
    return data.id;
}

window.onload = async () => {
    const authorizationCode = getAuthorizationCode();

    if (authorizationCode) {
        console.log('Código de autorização capturado:', authorizationCode);
        
        const accessToken = await exchangeCodeForToken(authorizationCode);
        console.log('Token de acesso:', accessToken);

        const userId = await getUserId(accessToken);
        console.log('ID do usuário:', userId);

        window.location.href = 'callback.html';
    } else {
        console.log('Nenhum código de autorização encontrado. Redirecione o usuário para login.');
        redirectToSpotifyAuth();
    }
};
