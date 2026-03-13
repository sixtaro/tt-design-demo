import './string';
import './objectx';
import './array';
import './number';
import './image';
import './date';
import Config from './config';
import Storage from './storage';
import Request from './request';
import * as Utils from './utils';
import getDefaultPass from './password';
const request = Request;
const get = Request;
const post = Request;
const utils = Utils;
const config = Config;
const storage = Storage;
export {
    Storage,
    storage,
    Config,
    config,
    Utils,
    utils,
    Request,
    request,
    get,
    post,
    getDefaultPass,
};
