import uniq from 'lodash/uniq';

export const findSwitchOnNodeIDs = treeData => {
    // 遍历树，将 on 属性为 true 的节点 id 找出来（不包含车场节点）
    let res = [];
    // 递归遍历树节点
    const traverse = nodes => {
        if (!nodes || !Array.isArray(nodes)) {
            return;
        }

        nodes.forEach(node => {
            // 检查当前节点是否符合条件
            if (node.on === true && node.isPark === false) {
                res.push(node.id);
            }

            // 递归处理子节点
            if (node.children && node.children.length > 0) {
                traverse(node.children);
            }
        });
    };
    traverse(treeData);

    return uniq(res);
};
