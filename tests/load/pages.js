import http from "k6/http";
import { check } from "k6";

const BASE = __ENV.BASE || "http://localhost:3931";
const MAX = Number(__ENV.MAX || 200);

const MIX = [
  [0.45, "/", "landing"],
  [0.2, "/tratamientos/spa-capilar", "categoria"],
  [0.15, "/tratamientos/spa-capilar/alisado", "tratamiento"],
  [0.07, "/tratamientos", "tratamientos"],
  [0.07, "/productos", "productos"],
  [0.03, "/tratamientos/unas/tradicional", "tratamiento"],
  [0.03, "/politica-de-datos", "politica"],
];

export const options = {
  scenarios: {
    paginas: {
      executor: "ramping-arrival-rate",
      startRate: 5,
      timeUnit: "1s",
      preAllocatedVUs: 100,
      maxVUs: 600,
      stages: [
        { target: Math.round(MAX * 0.25), duration: "20s" },
        { target: Math.round(MAX * 0.5), duration: "20s" },
        { target: Math.round(MAX * 0.75), duration: "20s" },
        { target: MAX, duration: "30s" },
        { target: MAX, duration: "30s" },
        { target: 0, duration: "10s" },
      ],
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    "http_req_duration{route:landing}": ["p(95)<800"],
    "http_req_duration{route:categoria}": ["p(95)<800"],
    "http_req_duration{route:tratamiento}": ["p(95)<800"],
    "http_req_duration{route:tratamientos}": ["p(95)<800"],
    "http_req_duration{route:productos}": ["p(95)<800"],
    "http_req_duration{route:politica}": ["p(95)<800"],
  },
  summaryTrendStats: ["avg", "p(50)", "p(95)", "p(99)", "max"],
};

function pick() {
  let r = Math.random();
  for (const [w, path, name] of MIX) {
    if ((r -= w) <= 0) return [path, name];
  }
  return MIX[0].slice(1);
}

export default function visitPage() {
  const [path, name] = pick();
  const res = http.get(BASE + path, { tags: { route: name }, headers: { "Accept-Encoding": "gzip" } });
  check(res, { "200": (r) => r.status === 200 });
}
