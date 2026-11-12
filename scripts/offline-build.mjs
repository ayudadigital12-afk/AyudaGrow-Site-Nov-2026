// The static build has no network dependency. Fail closed if a dependency tries to connect.
import net from 'node:net';
import http from 'node:http';
import https from 'node:https';
const blocked=()=>{throw new Error('Network access is disabled during the static build.');};
net.Socket.prototype.connect=blocked;
http.request=blocked;http.get=blocked;https.request=blocked;https.get=blocked;
globalThis.fetch=blocked;
await import('./build-search-pages.mjs');
