fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'mutation { login(email: "wrong@gmail.com", password: "wrongpassword") { accessToken } }'
  })
}).then(res => res.json()).then(console.log).catch(console.error);
