// server.mjs
import fetch from 'node-fetch';
const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNTQ2MDM3NSwiZXhwIjoxOTQxMDM2Mzc1fQ.IgHG-M4znmVhQEa6uWWb3gz-_XXjsSvPPF8NBad8gvk';

async function fetchScreens(appId) {
  const url = `https://ujasntkfphywizsdaapi.supabase.co/rest/v1/app_screens?id=eq.${appId}`;
  
  const headers = {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des écrans');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur:', error.message);
    return null;
  }
}

// Exemple d'utilisation
const appId = '02ab68af-70ab-47dd-992d-602a76a6bd5b';
fetchScreens(appId)
  .then(data => {
    console.log('Données récupérées:', data);
  })
  .catch(err => {
    console.error('Erreur:', err);
  });
