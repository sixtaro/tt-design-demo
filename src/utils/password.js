import request from './request';

const getDefaultPass = async (userGroupID, isManager) => {
    try {
        const res = await request(
            {
                _url: window.location.origin + window._baseURL_prefix + (isManager ? '/ManagerV2/home/usergroup/getDefaultPass' : '/PublicV2/home/group/usergroup/getDefaultPass'),
            },
            {
                userGroupID: userGroupID || 0,
            }
        );
        if (res.success) {
            return res.data.defaultPass;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

export default getDefaultPass;
