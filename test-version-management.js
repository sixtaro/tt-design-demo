// 测试版本管理功能
const { Button, versionUtils } = require('./dist/index.js');
const ttDesign = require('./dist/index.js').default;

console.log('=== 测试版本管理功能 ===');

// 测试 1: 获取整体库版本
console.log('\n1. 整体库版本:');
console.log('ttDesign.version:', ttDesign.version);

// 测试 2: 获取 Button 组件版本
console.log('\n2. Button 组件版本:');
console.log('Button.version:', Button.version);

// 测试 3: 使用版本管理工具函数
console.log('\n3. 版本管理工具函数测试:');

// 测试版本验证
const versions = ['1.0.0', '1.0.0-alpha', '1.0', '1', '1.0.0.0'];
console.log('版本验证测试:');
versions.forEach(version => {
  console.log(`  isValidVersion('${version}'):`, versionUtils.isValidVersion(version));
});

// 测试版本比较
console.log('\n版本比较测试:');
console.log('  compareVersions("1.0.1", "1.0.0"):', versionUtils.compareVersions('1.0.1', '1.0.0'));
console.log('  compareVersions("1.0.0", "1.0.1"):', versionUtils.compareVersions('1.0.0', '1.0.1'));
console.log('  compareVersions("1.0.0", "1.0.0"):', versionUtils.compareVersions('1.0.0', '1.0.0'));

// 测试获取组件版本
console.log('\n获取组件版本测试:');
console.log('  getComponentVersion(Button):', versionUtils.getComponentVersion(Button));

// 测试版本检查
console.log('\n版本检查测试:');
console.log('  checkComponentVersion(Button, "1.0.0"):', versionUtils.checkComponentVersion(Button, '1.0.0'));
console.log('  checkComponentVersion(Button, "1.1.0"):', versionUtils.checkComponentVersion(Button, '1.1.0'));
console.log('  checkComponentVersion(Button, "0.9.0"):', versionUtils.checkComponentVersion(Button, '0.9.0'));

// 测试 4: 验证版本号一致性
console.log('\n4. 版本号一致性验证:');
console.log('  库版本与配置文件一致:', ttDesign.version === '1.0.0');
console.log('  Button 版本与配置文件一致:', Button.version === '1.0.0');

console.log('\n=== 测试完成 ===');
