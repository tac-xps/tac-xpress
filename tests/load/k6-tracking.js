import http from 'k6/http';
import { check, sleep } from 'k6';

const awb = __ENV.SYNTHETIC_TRACKING_AWB;
if (!/^[A-Z0-9-]{5,40}$/.test(awb || '')) {
  throw new Error('Set SYNTHETIC_TRACKING_AWB to a published staging fixture');
}

export const options = {
  vus: 1,
  iterations: 10,
  thresholds: {
    checks: ['rate==1'],
    http_req_failed: ['rate==0'],
  },
};

export default function () {
  const res = http.get(`http://localhost:3001/track?awb=${encodeURIComponent(awb)}`, {
    redirects: 0,
    timeout: '15s',
    tags: { name: 'GET /track' },
  });

  check(res, {
    'renders the matching tracking result': (r) =>
      r.status === 200 &&
      r.html().find('button').toArray().some((button) => button.text().includes('Show full tracking')) &&
      r.html().find('p').toArray().some((paragraph) => paragraph.text().trim() === awb),
  });

  sleep(1);
}
