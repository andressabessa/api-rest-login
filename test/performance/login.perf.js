import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  iterations: 10,
};

export default function () {
  const url = 'http://localhost:3000/api/auth/login';
  const payload = JSON.stringify({
    email: 'user@example.com',
    password: 'password',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'Validar que o Status é 200': (r) => r.status === 200,
  });

  sleep(1);
}
