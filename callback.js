async function getUserTopTracks(accessToken, limit = 20, timeRange = 'medium_term') {
    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${timeRange}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    const data = await response.json();
    return data.items;
}

async function getRecommendations(accessToken, tracksIds, limit = 10) {
    const seedTracks = tracksIds.slice(0, 5).join(',');
    const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=${limit}&seed_tracks=${seedTracks}`, {
        method: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + accessToken
        }    
    });
    const data = await response.json();
    return data.tracks;
}

async function createPlaylist(accessToken, userId, name = "Pra você!") {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            description: "Uma playlist com suas músicas favoritas e algumas sugestões!",
            public: false
        })
    });
    const data = await response.json();
    return data.id; 
}

async function addTracksToPlaylist(accessToken, playlistId, trackUris) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uris: trackUris
        })    
    });
    return response.ok;
}

const BasedOnYou = document.getElementById('BasedOnYou');

BasedOnYou.addEventListener('click', async function() {
    try {
        const accessToken = localStorage.getItem('spotifyAccessToken');
        const userId = localStorage.getItem('spotifyUserId');

        if (!accessToken || !userId) {
            console.error('Token de acesso ou ID do usuário ausente!');
            return;
        }

        const topTracks = await getUserTopTracks(accessToken, 20, 'medium_term');
        const topTracksIds = topTracks.map(track => track.id);
        const recommendedTracks = await getRecommendations(accessToken, topTracksIds, 10);

        const combinedTracks = [...topTracks, ...recommendedTracks];
        const trackUris = combinedTracks.map(track => track.uri);

        const playlistId = await createPlaylist(accessToken, userId);
        const success = await addTracksToPlaylist(accessToken, playlistId, trackUris);

        if (success) {
            console.log("Playlist criada com sucesso!");
        } else {
            console.error("Erro ao adicionar músicas à playlist!");
        }

    } catch (error) {
        console.error("Erro ao criar a playlist!", error);
    }    
});
