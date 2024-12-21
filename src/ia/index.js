const ApiKeyHercai = "RtjHwyCkQGTmUm6NyZv3MR9Hoyda11NIMWcuqBR0=";
const fetch = require('node-fetch');
const ai = require('unlimited-ai');
let AiTempSave = {};


async function models() {
 return {text: ["gpt-4o-mini", "gpt-4-turbo", "gpt-4o", "grok-2", "grok-2-mini", "grok-beta", "claude-3-opus", "claude-3-sonnet", "claude-3-5-sonnet", "claude-3-5-sonnet-2", "gemini"], imagev2: ["dalle"]};
};


async function clear() {
AiTempSave = {};
return true;
};


function getModel(modelim) {
const modelinhos = {"gpt-4o-mini": "gpt-4o-mini", "gpt-4-turbo": "gpt-4-turbo-2024-04-09", "gpt-4o": "gpt-4o-2024-08-06", "grok-2": "grok-2", "grok-2-mini": "grok-2-mini", "grok-beta": "grok-beta", "claude-3-opus": "claude-3-opus-20240229", "claude-3-sonnet": "claude-3-sonnet-20240229", "claude-3-5-sonnet": "claude-3-5-sonnet-20240620", "claude-3-5-sonnet-2": "claude-3-5-sonnet-20241022", "gemini": "gemini-1.5-flash-exp-0827"};
const modelete = modelinhos[modelim] ? modelinhos[modelim] : "gpt-4o-2024-08-06";
return modelete;
};


async function iaFree(text, model = 'gpt-4o', idChat = false) {
if(!text) { throw new Error(`Falta forneceer um texto.`); };
const modelOfc = getModel(model);
if(!idChat) {
const formattedMessages = [{ role: 'user', content: text }];
const textinresposta = await ai.generate(modelOfc, formattedMessages);
return textinresposta;
} else {
if(!AiTempSave[idChat]) AiTempSave[idChat] = [];
const formattedMessages = [...AiTempSave[idChat].map(msg => ({ role: msg.role, content: msg.content })), { role: 'user', content: text }];
const textinresposta = await ai.generate(modelOfc, formattedMessages);
AiTempSave[idChat].push({ role: 'user', content: text });
AiTempSave[idChat].push({ role: 'assistant', content: textinresposta });
AiTempSave[idChat] = AiTempSave[idChat].slice(-10);
return textinresposta;
}};


function getModelImage(modelim) {
const modelinhos = {"dalle": "v3/text2image"};
const modelete = modelinhos[modelim] ? modelinhos[modelim] : "v3/text2image";
return modelete;
};


async function imageGenV2(textin, model = 'dalle') {
if(!textin) { throw new Error(`Falta forneceer um texto.`); };
const modelOfc = getModelImage(model);
const url = "https://hercai.onrender.com/"+modelOfc+"?prompt="+encodeURI(textin)+"&negative_prompt=bad%20quality";
const response = await fetch(url, { method: 'GET', headers: { "Content-Type": "application/json", "Authorization": ApiKeyHercai }});
if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); };
const api = await response.json();
return {url: api.url, prompt: textin, model: dalle};
};


module.exports = { iaFree, models, clear, imageGenV2 };