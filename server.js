const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000; // Port sur lequel le serveur écoutera

// Remplacez les valeurs suivantes par vos propres informations Supabase
const supabaseUrl = 'https://ujasntkfphywizsdaapi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNTQ2MDM3NSwiZXhwIjoxOTQxMDM2Mzc1fQ.IgHG-M4znmVhQEa6uWWb3gz-_XXjsSvPPF8NBad8gvk'; // Remplacez par votre token d'accès Supabase

// Initialise le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Route pour récupérer tous les écrans d'une application spécifique
app.get('/screens/:appId', async (req, res) => {
  const { appId } = req.params; // Récupère l'ID de l'application depuis l'URL

  try {
    // Effectue une requête à Supabase pour récupérer les écrans de l'application spécifiée
    const { data, error } = await supabase
      .from('app_screens')
      .select('*')
      .eq('appVersionId', appId);

    if (error) {
      console.error('Erreur lors de la récupération des écrans:', error.message);
      return res.status(500).json({ error: 'Erreur lors de la récupération des écrans depuis Supabase.' });
    }

    // Log des données récupérées
    console.log('Data:', data);

    res.json(data); // Renvoie les données des écrans en tant que réponse JSON
  } catch (error) {
    console.error('Erreur lors de la récupération des écrans:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des écrans depuis Supabase.' });
  }
});

// Lance le serveur Express
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
