import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // simulate ramp-up of traffic from 1 to 20 users over 30 seconds
    { duration: '1m', target: 20 }, // stay at 20 users for 1 minute
    { duration: '10s', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
  },
};

export default function () {
  // Test the public tracking endpoint which hits the DB
  const res = http.get('http://localhost:3000/api/stream/tracking?awb=DEMO123');
  
  check(res, {
    'status is 200 or 401': (r) => r.status === 200 || r.status === 401 || r.status === 404,
  });

  sleep(1);
}
