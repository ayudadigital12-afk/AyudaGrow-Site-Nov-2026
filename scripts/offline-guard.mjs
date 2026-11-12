// Local render and interaction checks must never contact external services.
import net from 'node:net';
import http from 'node:http';
import https from 'node:https';
const blocked=()=>{throw new Error('Outbound network is disabled for this local check.');};
net.Socket.prototype.connect=blocked;
http.request=blocked;http.get=blocked;https.request=blocked;https.get=blocked;
globalThis.fetch=blocked;
