const { detectSystemInfo, generateRandomName, getYouTubeID, ensureExecutable, handleFile, getVideoUrl, updateFile } = require('./../dist/utils.js');
const { Innertube, UniversalCache } = require("youtubei.js");
const { execFile, exec } = require("child_process");
const ai = require('./ia/index.js');
const path = require("path");
const fs = require("fs");
const os = require("os");
const fetch = require('node-fetch');




updateFile();




const tempPath = path.join(__dirname, "../temp");
const tempDirSystem = os.tmpdir();
let HiudyyDLPath = '';

async function clearSystemTempDir(tempDirSystem) {
  try {
    const command = "find " + tempDirSystem + " -mmin +2 -exec rm -rf {} \\;";
    exec(command, (err) => {
      if (err) {
        console.error('Erro ao limpar diretório temporário:', err.message);
      } else {
      }
    });
  } catch (err) {
    console.error('Erro geral:', err.message);
  }
}

function loadAndShuffleCookies() {
const cookiesPath = path.join(__dirname, "../dist/cookies.json");
const cookiesArray = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));
return cookiesArray.sort(() => Math.random() - 0.5);
};

async function findValidCookie() {
const cookiesArray = loadAndShuffleCookies();
const testedCookies = new Set();
for (const cookie of cookiesArray) {
if (testedCookies.has(cookie)) continue;
const tempCookiePath = path.join(__dirname, '../dist/cookie.txt');
fs.writeFileSync(tempCookiePath, cookie);
const isValid = await testCookie(tempCookiePath);
testedCookies.add(cookie);
if (isValid) {
return tempCookiePath;
}}
throw new Error('❌ [ERRO] Nenhum cookie válido foi encontrado.');
};

async function testCookie(cookiePath) {
const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const args = ["--no-cache-dir", "-F", "--cookies", cookiePath, url];
return new Promise((resolve, reject) => {
execFile(HiudyyDLPath, args, (error, stdout, stderr) => {
if (error) {
if (HiudyyDLPath.includes('hiudyydl_py')) {
execFile('python', [HiudyyDLPath, ...args], (pyErr, pyStdout, pyStderr) => {
if (pyErr) {
if (pyStderr.includes('This content isn') || (pyErr.message && pyErr.message.includes('This content isn'))) {
resolve(false);
} else {
resolve(true);
}} else {
resolve(true);
}});
} else if (stderr.includes('This content isn') || (error.message && error.message.includes('This content isn'))) {
resolve(false);
} else {
resolve(true);
}} else {
resolve(true);
}});
});
}

detectSystemInfo((error, architecture, platform) => {
  if (error) return console.error(`❌ [ERRO] Ao detectar o sistema: ${error.message}`);
  if (platform === 'android') {
    HiudyyDLPath = path.join(__dirname, "../bin/hiudyydl_py");
    console.log(`📱 [PLATAFORMA] Sistema Android detectado.`);
    console.log(`🚀 [@hiudyy/ytdl] Módulo inicializado com Python para Android.`);
    return;
  }
  if (platform !== 'linux' && platform !== 'win32') {
    return console.error(`❌ [PLATAFORMA] Este módulo é compatível apenas com sistemas Linux, Android e Windows.`);
  }
  console.log(`✅ [PLATAFORMA] Sistema detectado: ${platform}.`);

  switch (architecture) {
    case 'x64':
      HiudyyDLPath = path.join(__dirname, platform === 'win32' ? "../bin/hiudyydl_win_x64.zip" : "../bin/hiudyydl");
      console.log(`💻 [ARQUITETURA] Arquitetura x64 detectada.`);
      break;
    case 'arm':
      HiudyyDLPath = path.join(__dirname, "../bin/hiudyydl_v7");
      console.log(`🤖 [ARQUITETURA] Arquitetura ARM detectada.`);
      break;
    case 'arm64':
      HiudyyDLPath = path.join(__dirname, "../bin/hiudyydl_64");
      console.log(`🔧 [ARQUITETURA] Arquitetura ARM64 detectada.`);
      break;
    case 'x86':
      HiudyyDLPath = path.join(__dirname, "../bin/hiudyydl_win_x86.zip");
      console.log(`💻 [ARQUITETURA] Arquitetura x86 detectada.`);
      break;
    default:
      console.error(`❌ [ARQUITETURA] Arquitetura não suportada: ${architecture}`);
      return;
  }

  console.log(`✅ [@hiudyy/ytdl] Módulo inicializado com sucesso na arquitetura: ${architecture}.`);
});




async function processOutput(args, tempFile) {
await ensureExecutable(HiudyyDLPath);
return new Promise((resolve, reject) => {
execFile(HiudyyDLPath, args, (err, stdout, stderr) => {
if (err) {
if (HiudyyDLPath.includes('hiudyydl_py')) {
execFile('python', [HiudyyDLPath, ...args], (pyErr, pyStdout, pyStderr) => {
if (pyErr) {
reject(`Erro ao executar com Python: ${pyStderr || pyErr.message}`);
} else {
handleFile(tempFile, resolve, reject);
}})} else {
reject(`Hiudyydl error: ${stderr || err.message}`);
}} else {
handleFile(tempFile, resolve, reject);
}})})};




async function ytmp3(input) {
  await clearSystemTempDir();
  const url = getVideoUrl(input);
  const output = path.join(tempPath, generateRandomName("m4a"));
  const validCookiePath = await findValidCookie();

  const args = ["--no-cache-dir", "-f", "worstaudio", "--cookies", validCookiePath, "-o", output, url];
  
  return await processOutput(args, output);
};




async function ytmp4(input) {
  await clearSystemTempDir();
  const url = getVideoUrl(input);
  const output = path.join(tempPath, generateRandomName("mp4"));
  const validCookiePath = await findValidCookie();

  const args = ["--no-cache-dir", "-f", "bestvideo+worstaudio[ext=mp4]/mp4", "--cookies", validCookiePath, "-o", output, url];
  
  return await processOutput(args, output);
};




async function alldl(input) {
  await clearSystemTempDir();
  const url = input;
  const results = [];
  const tempPathDl = path.join(tempPath, `${Math.floor(Math.random() * 100000)}_${Math.floor(Math.random() * 100000)}`);
  const outputTemplate = path.join(tempPathDl, "%(title)s_%(id)s.%(ext)s");

  try {
    await ensureExecutable(HiudyyDLPath);
    const validCookiePath = await findValidCookie();

    // Argumentos para listar formatos disponíveis
    const formatArgs = ["--no-cache-dir", "-F", "--cookies", validCookiePath, url];

    const formats = await new Promise((resolve, reject) => {
      execFile(HiudyyDLPath, formatArgs, (error, stdout) => {
        if (error) return reject(error);
        resolve(stdout.trim());
      });
    });

    // Detecta tipos de arquivos suportados
    const hasAudio = /\.(mp3|m4a|aac|wav|flac|ogg|opus)$/i.test(formats) || formats.includes('audio');
    const hasVideo = /\.(mp4|mkv|avi|mov|wmv|flv|webm)$/i.test(formats) || formats.includes('video');
    const hasImages = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(formats) || formats.includes('image');
    const hasDocument = /\.(pdf|doc|docx|xls|xlsx|txt|ppt|pptx|zip|apk)$/i.test(formats) || formats.includes('document');

    const downloadArgsList = [];

    // Vídeo + Áudio com qualidade média
    if (hasVideo || !hasAudio) {
      downloadArgsList.push(["--no-cache-dir", "-f", "bestvideo+worstaudio/best", "--merge-output-format", "mp4", "--cookies", validCookiePath, "--output", outputTemplate, "--no-warnings"]);
    }

    // Áudio com qualidade mais baixa e rápido
    if (hasAudio) {
      downloadArgsList.push([
        "--no-cache-dir",
        "-f",
        "worstaudio",
        "--cookies",
        validCookiePath,
        "--output",
        outputTemplate,
        "--no-warnings",
        "--socket-timeout", "10",
        "--concurrent-fragments", "16",
      ]);
    }

    // Imagens
    if (hasImages) {
      downloadArgsList.push([
        "--no-cache-dir",
        "-f",
        "best",
        "--cookies",
        validCookiePath,
        "--output",
        outputTemplate,
        "--no-warnings",
        "--yes-playlist",
      ]);
    }

    // Documentos
    if (hasDocument) {
      downloadArgsList.push([
        "--no-cache-dir",
        "-f",
        "best",
        "--cookies",
        validCookiePath,
        "--output",
        outputTemplate,
        "--no-warnings",
      ]);
    }

    // Executa os downloads
    for (const args of downloadArgsList) {
      await new Promise((resolve, reject) => {
        execFile(HiudyyDLPath, args.concat(url), (error, stdout, stderr) => {
          if (error) {
            if (HiudyyDLPath.includes("hiudyydl_py")) {
              execFile("python", [HiudyyDLPath, ...args, url], (pyErr, pyStdout, pyStderr) => {
                if (pyErr) return reject(`Hiudyydl error: ${pyStderr || pyErr.message}`);
                resolve(pyStdout.trim());
              });
            } else {
              return reject(`Hiudyydl error: ${stderr || error.message}`);
            }
          } else {
            resolve(stdout.trim());
          }
        });
      });
    }

    // Processa os arquivos baixados
    const files = fs.readdirSync(tempPathDl);
    for (const file of files) {
      const filePath = path.join(tempPathDl, file);
      const extension = path.extname(file).toLowerCase();
      const convertedFilePath = path.join(tempPathDl, `converted_${path.basename(file, extension)}.mp4`);

      if ([".mp4", ".mkv", ".webm"].includes(extension)) {
        try {
          await convertToCompatibleVideo(filePath, convertedFilePath); // Converte o vídeo para formato compatível
          const buffer = fs.readFileSync(convertedFilePath);
          results.push({ type: "video", src: buffer, mimetype: "video/mp4" });
          fs.unlinkSync(filePath); // Remove o arquivo original
          fs.unlinkSync(convertedFilePath); // Remove o arquivo convertido
        } catch (conversionError) {
          console.error("Erro ao converter vídeo:", conversionError);
        }
      } else if ([".mp3", ".m4a", ".opus"].includes(extension)) {
        const buffer = fs.readFileSync(filePath);
        results.push({ type: "audio", src: buffer, mimetype: "audio/mpeg" });
        fs.unlinkSync(filePath);
      } else if ([".jpg", ".jpeg", ".png", ".webp"].includes(extension)) {
        const buffer = fs.readFileSync(filePath);
        results.push({ type: "image", src: buffer, mimetype: "image/jpg" });
        fs.unlinkSync(filePath);
      } else if ([".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".ppt", ".pptx"].includes(extension)) {
        const buffer = fs.readFileSync(filePath);
        results.push({ type: "document", src: buffer, mimetype: "application/octet-stream" });
        fs.unlinkSync(filePath);
      } else if ([".zip"].includes(extension)) {
        const buffer = fs.readFileSync(filePath);
        results.push({ type: "document", src: buffer, mimetype: "application/zip" });
        fs.unlinkSync(filePath);
      } else if ([".apk"].includes(extension)) {
        const buffer = fs.readFileSync(filePath);
        results.push({ type: "document", src: buffer, mimetype: "application/vnd.android.package-archive" });
        fs.unlinkSync(filePath);
      } else {
        const buffer = fs.readFileSync(filePath);
        results.push({ type: "unknown", src: buffer, mimetype: "application/octet-stream" });
        fs.unlinkSync(filePath);
      }
    }
  } catch (err) {
    console.error("Erro ao baixar:", err);
  }

  return results;
}

async function convertToCompatibleVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = `ffmpeg -i "${inputPath}" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k -movflags +faststart "${outputPath}"`;
    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.error("FFmpeg error:", stderr || error.message);
        return reject(error);
      }
      resolve();
    });
  });
}




async function yts(query) {
await clearSystemTempDir();
const yt = await Innertube.create({ cache: new UniversalCache() });
const search = await yt.search(query);
return search;
};




module.exports = { 
ytmp3, 
ytmp4,
ytadl: ytmp3, 
ytvdl: ytmp4, 
alldl, 
yts, 
ai: ai,
update: updateFile,
clear: clearSystemTempDir
};