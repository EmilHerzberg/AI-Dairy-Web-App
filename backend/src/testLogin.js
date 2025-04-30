const fetch = require('node-fetch');

(async () => {
  try {
    const res = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'you@example.com', password: 'SecurePass123' })
    });
    const data = await res.text();
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err);
  }
})();
