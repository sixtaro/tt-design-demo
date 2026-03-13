/* eslint-disable no-unused-vars */
/* 转换坐标格式
支持的格式：
"129.321,32.321 129.321,32.321"
[129.321, 32.321]
["129.321,32.321"]
[[129.321,32.321],[129.321,32.321]]
[{x: 129.321, y: 32.321},{x: 129.321, y: 32.321}]
"[{x: 129.321, y: 32.321},{x: 129.321, y: 32.321}]"
*/
/* eslint-disable camelcase */
export const getCoordinates = (coordinatesOriginal, { geoType, coordinateType } = {}) => {
    let coordinates = [];
    let type = geoType;
    const push = (point) => {
        coordinates.push(point);
    }
    if (typeof coordinatesOriginal === "string") {
        if (coordinatesOriginal.indexOf('[') > -1) {
            coordinatesOriginal = eval(coordinatesOriginal);
        } else {
            // 经纬度分隔符
            let x_y = '';
            // 坐标分隔符
            let xy_xy = '';
            // 分隔符
            const separator = [',', ' ', '|', '_', ';', ':'];
            // 检测坐标使用的分隔符
            let separatorIndex = -1;
            for (let i = 0; i < separator.length; i++) {
                const index = coordinatesOriginal.indexOf(separator[i]);
                if (index > -1) {
                    if (separatorIndex > -1) {
                        x_y = separator[Math.min(index, separatorIndex)];
                        xy_xy = separator[Math.max(index, separatorIndex)];
                        break;
                    } else {
                        separatorIndex = index;
                    }
                }
            }
            if (x_y && xy_xy) {
                const xys = coordinatesOriginal.split(xy_xy);
                xys.forEach(xy => {
                    const point = xy.split(x_y);
                    push(point);
                });
            } else if (separatorIndex) {
                x_y = separator[separatorIndex];
                const xy = coordinatesOriginal.split(x_y);
                push(xy);
            }

        }
    }
    if (coordinatesOriginal instanceof Array) {
        if (coordinatesOriginal.length === 2 && !isNaN(coordinatesOriginal[0])) {
            push(coordinatesOriginal);
        } else {
            coordinatesOriginal.forEach(c => {
                if (c instanceof Array) {
                    push(c);
                } else if (typeof c === "object") {
                    push([c.x || c.coordinateX || c.lng || c.longitude, c.y || c.coordinateY || c.lat || c.latitude]);
                } else if (typeof c === "string") {
                    push([Number(c.split(',')[0]), Number(c.split(',')[1])]);
                }
            });
        }
    }
    if (type) {
        if (type === "Point") {
            coordinates = coordinates[0];
        } else if (type === "LineString") {
            // 不处理
        } else if (type === "Polygon") {
            coordinates = [coordinates];
        }
    } else {
        if (coordinates.length === 1) {
            type = 'Point';
            coordinates = coordinates[0];
        } else if (coordinates.length === 2) {
            type = 'LineString';
        } else if (coordinates.length >= 3) {
            type = 'Polygon';
            coordinates = [coordinates];
        }
    }
    return {
        type,
        coordinates,
    }
};

export const getGeoJSONData = (datas, type, property) => {
    return {
        type: 'FeatureCollection',
        features: datas.map((item) => {
            return {
                type: 'Feature',
                properties: {
                    ...(item.property || {}),
                    ...(property || {}),
                },
                geometry: {
                    type: type,
                    coordinates: item.position,
                },
            };
        }),
    };
};
export const getGeoJSON = (datas, type, properties) => {
    return {
        type: 'FeatureCollection',
        features: datas.filter(item => !!item).map((item) => {
            return {
                type: 'Feature',
                properties: {
                    ...(item.properties || {}),
                    ...(properties || {}),
                },
                geometry: getCoordinates(item.coordinates, { geoType: type }),
            };
        }),
    };
};
export const getGeo = (datas, type, properties) => {
    return {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {
                ...(properties || {}),
            },
            geometry: getCoordinates(datas, { geoType: type }),
        }]
    };
};
const getPoint = (x, y) => {
    if (x && y) {
        return [x, y];
    }
    if (x instanceof Array) {
        return x;
    }
    if (typeof x === "object") {
        return [x.x || x.lng || x.longitude || x.coordinateX, x.y || x.lat || x.latitude || x.coordinateY];
    }
}
export const fixPolygon = path => {
    if (!Object.equal(getPoint(path[0]), getPoint(path[path.length - 1]))) {
        path.push(path[0]);
    }
    return path;
};
