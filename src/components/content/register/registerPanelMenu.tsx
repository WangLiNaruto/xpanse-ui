/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { AppstoreAddOutlined } from '@ant-design/icons';
import { MenuItemType } from 'antd/es/menu/interface';
import { Link } from 'react-router-dom';
import { registerPageRoute } from '../../utils/constants';

function registerPanelMenu(): MenuItemType {
    return {
        key: registerPageRoute,
        label: <Link to={registerPageRoute}>Register Panel</Link>,
        icon: <AppstoreAddOutlined />,
        title: 'RegisterPanel',
    };
}

export default registerPanelMenu;
