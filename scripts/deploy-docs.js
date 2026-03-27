/**
 * 文档站部署脚本
 *
 * 用法:
 *   本地开发: STORYBOOK_BASE_URL=/ yarn build:docs
 *   构建部署: STORYBOOK_BASE_URL=/tt-design-demo/ yarn build:docs
 *
 * 输出结构:
 *   storybook-static/
 *   ├── index.html          # 首页
 *   └── storybook/          # Storybook
 *       ├── index.html
 *       └── ...
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'storybook-static');
const STORYBOOK_DIR = path.join(OUTPUT_DIR, 'storybook');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const HOME_HTML = path.join(PUBLIC_DIR, 'index.html');

// 获取 base URL，默认为 /
const BASE_URL = process.env.STORYBOOK_BASE_URL || '/';

console.log('📦 tt-design 文档站构建');
console.log('─'.repeat(40));

// 1. 清理旧构建
console.log('\n🧹 清理旧构建...');
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true });
}

// 2. 构建 Storybook
console.log('\n📚 构建 Storybook (base: ' + BASE_URL + ')...');
execSync(`STORYBOOK_BASE_URL=${BASE_URL} npm run build-storybook`, {
  stdio: 'inherit',
  cwd: ROOT_DIR
});

// 3. 创建 storybook 子目录
console.log('\n📁 重组目录结构...');
if (!fs.existsSync(STORYBOOK_DIR)) {
  fs.mkdirSync(STORYBOOK_DIR, { recursive: true });
}

// 4. 移动 Storybook 文件到 storybook/ 子目录
// Storybook 输出在 storybook-static/，需要移动到 storybook-static/storybook/
const files = fs.readdirSync(OUTPUT_DIR);
files.forEach(file => {
  if (file === 'storybook') return; // 跳过刚创建的目录
  const src = path.join(OUTPUT_DIR, file);
  const dest = path.join(STORYBOOK_DIR, file);
  if (fs.statSync(src).isFile()) {
    fs.renameSync(src, dest);
  } else if (fs.statSync(src).isDirectory()) {
    fs.renameSync(src, dest);
  }
});

// 5. 复制首页
console.log('\n📄 复制首页...');
const destHtml = path.join(OUTPUT_DIR, 'index.html');
fs.copyFileSync(HOME_HTML, destHtml);

// 6. 验证结构
console.log('\n📂 最终目录结构:');
console.log('   storybook-static/');
console.log('   ├── index.html');
console.log('   └── storybook/');
const storybookFiles = fs.readdirSync(STORYBOOK_DIR).slice(0, 5);
storybookFiles.forEach(f => console.log('       └── ' + f));
if (fs.readdirSync(STORYBOOK_DIR).length > 5) {
  console.log('       └── ...');
}

console.log('\n' + '─'.repeat(40));
console.log('✅ 构建完成！');
console.log('\n📤 部署命令:');
console.log(`   npx gh-pages -d storybook-static \\`);
console.log(`     -r git@github.com:sixtaro/tt-design-demo.git`);
console.log('\n🌐 部署后访问:');
if (BASE_URL === '/') {
  console.log('   首页: https://sixtaro.github.io/tt-design-demo/');
  console.log('   Storybook: https://sixtaro.github.io/tt-design-demo/storybook/');
} else {
  console.log(`   首页: https://sixtaro.github.io${BASE_URL}`);
  console.log(`   Storybook: https://sixtaro.github.io${BASE_URL}storybook/`);
}
