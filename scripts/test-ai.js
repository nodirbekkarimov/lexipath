const apiKey = process.env.GEMINI_API_KEY || '';

async function test(model) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say hello in 3 words' }] }]
      })
    });
    clearTimeout(timer);
    const data = await res.json();
    console.log(`[${model}] Result:`, data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.error?.message);
  } catch (err) {
    console.log(`[${model}] Error:`, err.message);
  }
}

async function run() {
  await test('gemini-3.8-flash');
}

run();
