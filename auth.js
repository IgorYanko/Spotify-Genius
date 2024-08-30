const clientId = '1fd64948cbdd44d29396ce9aca70ee5d';
const redirectUri = 'https://igoryanko.github.io/Spotify-Genius/';
const scopes = 'user-read-private user-read-email';
const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

function redirectToSpotifyAuth() {
    window.location.href = authUrl;
}