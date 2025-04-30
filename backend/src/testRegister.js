// testRegister.js
const fetch = require('node-fetch'); // or axios

(async () => {
  try {
    const response = await fetch('http://localhost:5000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'you@example.com',
        password: 'SecurePass123',
        username: 'you',
      })
    });

    if (!response.ok) {
      throw new Error(`Server error. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
})();
