import React, { createContext, useCallback, useState } from 'react';
import { request } from '@/utils';

const ReplaceContext = createContext();

const ReplaceProvider = ({ children }) => {
    const [textReplacements, setTextReplacements] = useState({
        memberCard: '会员卡'
    });

    const fetchTextReplacements = useCallback(async () => {
        try {
            const res = await request('../PublicV2/home/group/groupcard/get-user-group-function-name');
            if (res?.success && res.data?.length > 0) {
                const result = {};
                res.data.forEach(item => {
                    if (item.functionType === 1) {
                        result['memberCard'] = item.name;
                        window._memberCardText = item.name;
                    }
                })
                setTextReplacements(prev => ({
                    ...prev,
                    ...result
                }));
            }
        } catch (error) {
            console.error('Failed to fetch text replacements', error);
        }
    }, []);

    const updateConfig = () => {
        fetchTextReplacements();
    };

    return (
        <ReplaceContext.Provider value={{ textReplacements, updateConfig }}>
            {children}
        </ReplaceContext.Provider>
    );
};

export { ReplaceProvider, ReplaceContext };
