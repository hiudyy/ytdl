const ApiKeyHercai = "RtjHwyCkQGTmUm6NyZv3MR9Hoyda11NIMWcuqBR0=";
import fetch from 'node-fetch';
import aiLibrary from 'unlimited-ai';

let AiTempSave = {};

async function models() {
  return {
    text: ["gpt-4o-mini", "gpt-4-turbo", "gpt-4o", "grok-2", "grok-2-mini", "grok-beta", "claude-3-opus", "claude-3-sonnet", "claude-3-5-sonnet", "claude-3-5-sonnet-2", "gemini"],
    imagev2: ["dalle", "v1", "v2", "v2-beta", "lexica", "prodia", "simurg", "animefy", "raava", "shonin"]
  };
}

async function clear() {
  AiTempSave = {};
  return true;
}

function getModel(modelim) {
  const modelMap = {
    "gpt-4o-mini": "gpt-4o-mini",
    "gpt-4-turbo": "gpt-4-turbo-2024-04-09",
    "gpt-4o": "gpt-4o-2024-08-06",
    "grok-2": "grok-2",
    "grok-2-mini": "grok-2-mini",
    "grok-beta": "grok-beta",
    "claude-3-opus": "claude-3-opus-20240229",
    "claude-3-sonnet": "claude-3-sonnet-20240229",
    "claude-3-5-sonnet": "claude-3-5-sonnet-20240620",
    "claude-3-5-sonnet-2": "claude-3-5-sonnet-20241022",
    "gemini": "gemini-1.5-flash-exp-0827"
  };
  return modelMap[modelim] || "gpt-4o-2024-08-06";
}

function getModelImage(modelim) {
  const modelMap = {
    "dalle": "v3/text2image",
    "v1": "v1/text2image",
    "v2": "v2/text2image",
    "v2-beta": "v2-beta/text2image",
    "lexica": "lexica/text2image",
    "prodia": "prodia/text2image",
    "simurg": "simurg/text2image",
    "animefy": "animefy/text2image",
    "raava": "raava/text2image",
    "shonin": "shonin/text2image"
  };
  return modelMap[modelim] || "v3/text2image";
}

async function imageGenV2(textin, model = 'dalle') {
  if (!textin) throw new Error("Falta fornecer um texto.");
  const modelOfc = getModelImage(model);
  const url = `https://hercai.onrender.com/${modelOfc}?prompt=${encodeURIComponent(textin)}&negative_prompt=bad%20quality`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { "Content-Type": "application/json", "Authorization": ApiKeyHercai }
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const apiResponse = await response.json();
  return { url: apiResponse.url, prompt: textin, model: model };
}

async function ia(text, model = 'gpt-4o', idChat = false) {
  if (!text) throw new Error("Falta fornecer um texto.");
  const modelOfc = getModel(model);
  if (!idChat) {
    const formattedMessages = [{ role: 'user', content: text }];
    const response = await aiLibrary.generate(modelOfc, formattedMessages);
    return response;
  } else {
    if (!AiTempSave[idChat]) AiTempSave[idChat] = [];
    const formattedMessages = [
      ...AiTempSave[idChat].map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: text }
    ];
    const response = await aiLibrary.generate(modelOfc, formattedMessages);
    AiTempSave[idChat].push({ role: 'user', content: text });
    AiTempSave[idChat].push({ role: 'assistant', content: response });
    AiTempSave[idChat] = AiTempSave[idChat].slice(-10);
    return response;
  }
}

const ai = Object.assign(ia, {
  models,
  clear,
  imagev2: imageGenV2
});

export default ai;