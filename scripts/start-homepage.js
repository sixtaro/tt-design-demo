const { spawn } = require('child_process');
const http = require('http');

const PORT = 3000;
const STORYBOOK_PORT = 6006;
const STORYBOOK_URL = `http://localhost:${STORYBOOK_PORT}`;

// 检查端口是否可用
function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, () => {
      resolve(true);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// 打开浏览器
function openBrowser(url) {
  const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  spawn(start, [url], { detached: true, stdio: 'ignore' }).unref();
}

// 启动服务
async function main() {
  console.log('🚀 启动 tt-design 首页...\n');

  // 启动静态文件服务器 (首页)
  console.log(`📦 启动首页服务器: http://localhost:${PORT}`);
  const serve = spawn('npx', ['serve', 'public', '-p', String(PORT)], {
    stdio: 'inherit',
    shell: true
  });

  // 等待首页服务启动
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 启动 Storybook
  console.log(`📚 启动 Storybook: http://localhost:${STORYBOOK_PORT}`);
  const storybook = spawn('npm', ['run', 'storybook'], {
    stdio: 'inherit',
    shell: true
  });

  // 等待 Storybook 启动，然后打开浏览器
  console.log('\n🌐 等待服务启动...\n');

  // 轮询检查 Storybook 是否就绪
  let storybookReady = false;
  for (let i = 0; i < 60; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const ready = await checkPort(STORYBOOK_PORT);
    if (ready) {
      storybookReady = true;
      break;
    }
    process.stdout.write('.');
  }

  if (storybookReady) {
    console.log('\n\n✅ 服务已就绪!');
    console.log(`   首页: http://localhost:${PORT}`);
    console.log(`   Storybook: ${STORYBOOK_URL}`);
    openBrowser(`http://localhost:${PORT}`);
  } else {
    console.log('\n\n⚠️ Storybook 启动可能需要更长时间，请手动访问:');
    console.log(`   首页: http://localhost:${PORT}`);
    console.log(`   Storybook: ${STORYBOOK_URL}`);
  }

  // 处理退出
  process.on('SIGINT', () => {
    serve.kill();
    storybook.kill();
    process.exit();
  });
}

main();
