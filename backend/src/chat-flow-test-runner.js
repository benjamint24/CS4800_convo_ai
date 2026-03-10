const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const app = require('./app');

const testEmail = `chatflow_${Date.now()}@example.com`;
const testPassword = 'Pass1234!';

async function requestJson(baseUrl, route, options = {}) {
  const response = await fetch(`${baseUrl}${route}`, options);
  const text = await response.text();
  let body;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text };
  }

  return {
    status: response.status,
    ok: response.ok,
    body
  };
}

function summarizeAssistant(body) {
  if (!body || typeof body.assistantMessage !== 'string') {
    return '';
  }
  return body.assistantMessage.slice(0, 160);
}

(async () => {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const results = {
    setup: {
      date: new Date().toISOString(),
      baseUrl,
      email: testEmail
    },
    auth: {},
    chat: {},
    multiTurn: [],
    regression: {}
  };

  try {
    // Auth baseline
    results.auth.register = await requestJson(baseUrl, '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });

    results.auth.login = await requestJson(baseUrl, '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });

    let token = results.auth.login.body && results.auth.login.body.token;
    if (!token) {
      token = jwt.sign({ userId: 'fallback-test-user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      results.auth.fallbackTokenUsed = true;
    } else {
      results.auth.fallbackTokenUsed = false;
    }

    const authHeader = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Core + negative chat paths
    results.chat.missingToken = await requestJson(baseUrl, '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hola' })
    });

    results.chat.invalidToken = await requestJson(baseUrl, '/api/chat', {
      method: 'POST',
      headers: { Authorization: 'Bearer invalid.token.value', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hola' })
    });

    results.chat.emptyMessage = await requestJson(baseUrl, '/api/chat', {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({ message: '   ' })
    });

    results.chat.invalidHistory = await requestJson(baseUrl, '/api/chat', {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({
        message: 'Hola',
        history: [{ role: 'bad-role', content: 'x' }]
      })
    });

    results.chat.successSingleTurn = await requestJson(baseUrl, '/api/chat', {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({ message: 'Hola, quisiera ordenar una paella.' })
    });

    // Multi-turn scripted flows
    async function runTwoTurnFlow(flowId, turn1, turn2, continuityHint) {
      const first = await requestJson(baseUrl, '/api/chat', {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify({ message: turn1 })
      });

      const history = [];
      if (first.ok && first.body && first.body.assistantMessage) {
        history.push({ role: 'user', content: turn1 });
        history.push({ role: 'assistant', content: first.body.assistantMessage });
      }

      const second = await requestJson(baseUrl, '/api/chat', {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify({ message: turn2, history })
      });

      const secondText = (second.body && second.body.assistantMessage) || '';
      const continuityPass = second.ok && secondText.toLowerCase().includes(continuityHint.toLowerCase());

      results.multiTurn.push({
        id: flowId,
        turn1,
        turn2,
        firstStatus: first.status,
        secondStatus: second.status,
        continuityHint,
        continuityPass,
        turn1Preview: summarizeAssistant(first.body),
        turn2Preview: summarizeAssistant(second.body)
      });
    }

    await runTwoTurnFlow(
      'F1-order-modify',
      'Quiero una paella de mariscos.',
      'Mejor cambiala por una opcion vegetariana, por favor.',
      'veget'
    );

    await runTwoTurnFlow(
      'F2-food-then-drink',
      'Quiero unas tapas.',
      'Y para beber, que me recomiendas?',
      'beber'
    );

    await runTwoTurnFlow(
      'F3-allergy-clarify',
      'Tengo alergia a los frutos secos, que me recomiendas?',
      'Entonces pido algo sin frutos secos y sin salsa de nuez.',
      'frutos secos'
    );

    await runTwoTurnFlow(
      'F4-billing-close',
      'Quiero una tortilla espanola y agua.',
      'Perfecto, ahora me trae la cuenta por favor.',
      'cuenta'
    );

    await runTwoTurnFlow(
      'F5-offtopic-redirect',
      'Quiero una paella.',
      'Que opinas de la politica internacional?',
      'orden'
    );

    // Regression checks
    results.regression.loginWrongPassword = await requestJson(baseUrl, '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'WrongPassword123!' })
    });

    results.regression.registerMissingFields = await requestJson(baseUrl, '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `bad_${Date.now()}@example.com` })
    });

    fs.writeFileSync(
      path.join(__dirname, 'chat-flow-test-output.json'),
      JSON.stringify(results, null, 2),
      'utf8'
    );

    console.log('CHAT_FLOW_TEST_COMPLETED');
    console.log(JSON.stringify({
      authRegister: results.auth.register.status,
      authLogin: results.auth.login.status,
      singleTurn: results.chat.successSingleTurn.status,
      multiTurnPassCount: results.multiTurn.filter((x) => x.continuityPass).length,
      multiTurnTotal: results.multiTurn.length
    }, null, 2));
  } catch (error) {
    console.error('CHAT_FLOW_TEST_FAILED', error.message);
    process.exitCode = 1;
  } finally {
    server.close();
  }
})();
