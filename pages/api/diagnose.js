export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ctx, brand, model, symptoms } = req.body;

  if (!symptoms || !symptoms.trim()) {
    return res.status(400).json({ error: "Symptômes requis" });
  }

  const systemPrompt = `Tu es un expert technique senior en fermeture industrielle et copropriété/syndic (portails automatiques, portes de garage, portes industrielles, automatismes, motorisations, armoires de commande, contrôle d'accès). Tu assistes un technicien SAV sur le terrain.
Réponds UNIQUEMENT avec un JSON valide (pas de texte autour, pas de backticks) :
{"synthese":"...","causes":[{"cause":"Nom court","probabilite":"Élevée|Moyenne|Faible","explication":"...","verifications":["Étape 1","Étape 2"]}],"securite":"... ou null"}
2 à 4 causes classées par probabilité. Vocabulaire métier français.`;

  const userMessage = `Contexte: ${ctx === "copro" ? "Copropriété/syndic" : "Site industriel"}
Marque: ${brand || "non précisée"}
Modèle: ${model || "non précisé"}
Symptômes: ${symptoms}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();
    const text = data.content.map((b) => b.text || "").join("").trim();
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);
  } catch (error) {
    console.error("Diagnostic error:", error);
    return res.status(500).json({ error: "Erreur lors du diagnostic" });
  }
}
