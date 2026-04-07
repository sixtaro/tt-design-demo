import React, { useState } from 'react';
import SwitchBtn from './components/switchBtn';
import Content from './components/content';
import './helpCenter.less';

const HelpCenter = props => {
    const { rightID, api, param } = props;
    const [open, setOpen] = useState(false);

    return Number.isInteger(+rightID) ? (
        <div className="help-wrapper">
            <SwitchBtn open={open} setOpen={setOpen} />
            <Content open={open} setOpen={setOpen} api={api} param={param} rightID={rightID}/>
        </div>
    ) : (
        ''
    );
};

export default HelpCenter;
