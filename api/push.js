// Vercel Serverless Function — push recipes to Supabase
// Bypasses browser body-size and CORS issues

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'Missing data field' });
    }

    // Validate it's proper JSON array
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length < 3) {
      return res.status(400).json({ error: `Invalid: ${parsed.length} recipes (need 3+)` });
    }

    const sizeKB = (data.length / 1024).toFixed(0);

    // Push to Supabase via REST API directly
    const response = await fetch(
      `${supabaseUrl}/rest/v1/recipes?on_conflict=id`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          id: 'shared',
          data: data,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: `Supabase error ${response.status}`,
        details: errText,
        sizeKB,
      });
    }

    // Verify
    const verifyRes = await fetch(
      `${supabaseUrl}/rest/v1/recipes?id=eq.shared&select=data`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );
    const verifyData = await verifyRes.json();
    let verifiedCount = 0;
    if (verifyData && verifyData[0] && verifyData[0].data) {
      const saved = JSON.parse(verifyData[0].data);
      verifiedCount = saved.length;
    }

    return res.status(200).json({
      success: true,
      sent: parsed.length,
      verified: verifiedCount,
      sizeKB,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
