/**
 * 版本管理工具函数
 * 遵循 SemVer 规范
 */

/**
 * 验证版本号是否符合 SemVer 规范
 * @param {string} version - 版本号
 * @returns {boolean} - 是否符合规范
 */
export const isValidVersion = (version) => {
  const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/;
  return semverRegex.test(version);
};

/**
 * 比较两个版本号
 * @param {string} version1 - 第一个版本号
 * @param {string} version2 - 第二个版本号
 * @returns {number} - 1: version1 > version2, 0: 相等, -1: version1 < version2
 */
export const compareVersions = (version1, version2) => {
  if (!isValidVersion(version1) || !isValidVersion(version2)) {
    throw new Error('版本号格式不正确');
  }

  const v1Parts = version1.split('.').map(part => {
    const [num, pre] = part.split('-');
    return { num: parseInt(num, 10), pre };
  });

  const v2Parts = version2.split('.').map(part => {
    const [num, pre] = part.split('-');
    return { num: parseInt(num, 10), pre };
  });

  for (let i = 0; i < 3; i++) {
    if (v1Parts[i].num > v2Parts[i].num) return 1;
    if (v1Parts[i].num < v2Parts[i].num) return -1;
  }

  // 比较预发布版本
  if (v1Parts[2].pre && !v2Parts[2].pre) return -1;
  if (!v1Parts[2].pre && v2Parts[2].pre) return 1;
  if (v1Parts[2].pre && v2Parts[2].pre) {
    if (v1Parts[2].pre > v2Parts[2].pre) return 1;
    if (v1Parts[2].pre < v2Parts[2].pre) return -1;
  }

  return 0;
};

/**
 * 获取组件版本信息
 * @param {React.Component} Component - 组件
 * @returns {string} - 组件版本号
 */
export const getComponentVersion = (Component) => {
  return Component.version || 'unknown';
};

/**
 * 检查组件版本是否满足要求
 * @param {React.Component} Component - 组件
 * @param {string} requiredVersion - 要求的版本号
 * @returns {boolean} - 是否满足要求
 */
export const checkComponentVersion = (Component, requiredVersion) => {
  const componentVersion = getComponentVersion(Component);
  if (componentVersion === 'unknown') return false;
  
  try {
    return compareVersions(componentVersion, requiredVersion) >= 0;
  } catch (error) {
    return false;
  }
};
