const { createClient } = require("@supabase/supabase-js");
const express = require("express");
const app = express();
const port = 3000;

// Créer un client Supabase
const supabaseUrl = "https://ujasntkfphywizsdaapi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNTQ2MDM3NSwiZXhwIjoxOTQxMDM2Mzc1fQ.IgHG-M4znmVhQEa6uWWb3gz-_XXjsSvPPF8NBad8gvk";
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Route pour récupérer tous les screens d'une application spécifique
app.get("/screens/:appId", async (req, res) => {
  const appId = req.params.appId;

  try {
    // Utiliser Supabase pour récupérer tous les screens de l'application spécifiée par appId
    const { data, error } = await supabase
      .from("app_screens")
      .select()
      .eq("id", appId);

    res.json(data);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .send("Erreur lors de la récupération des screens depuis Supabase.");
  }
});

// Route pour scrapper les applications
app.get("/scrape", async (req, res) => {
  const appNamePrefix = req.query.prefix || ""; // Récupérer le préfixe de l'URL ou utiliser une chaîne vide par défaut

  try {
    // Utiliser Supabase pour récupérer les données des applications
    const { data, error } = await supabase
      .from("apps")
      .select("id, platform, appName, appLogoUrl, trending_metric")
      .eq("platform", "ios")
      .like("appName", `${appNamePrefix}%`)
      .order("trending_metric", { ascending: false })
      .limit(7);

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .send("Erreur lors de la récupération des données depuis Supabase.");
  }
});

// Nouvelle route pour obtenir le schéma de la base de données
app.get("/schema", async (req, res) => {
  try {
    // Manually list the tables you are interested in
    const tables = ["app_screens", "apps"]; // Add more tables as needed

    // Function to get columns for a table
    const getColumns = async (table) => {
      const { data, error } = await supabase.from(table).select("*").limit(1);

      if (error) {
        throw error;
      }

      if (data.length > 0) {
        return Object.keys(data[0]);
      } else {
        return [];
      }
    };

    // For each table, fetch the columns
    const schema = await Promise.all(
      tables.map(async (table) => {
        const columns = await getColumns(table);
        return {
          table,
          columns,
        };
      })
    );

    res.json(schema);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .send("Erreur lors de la récupération du schéma depuis Supabase.");
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
