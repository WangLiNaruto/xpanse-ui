/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { AreaChartOutlined, BarsOutlined, HddOutlined } from '@ant-design/icons';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import {
    monitorLabelName,
    monitorPageRoute,
    myServicesLabelName,
    myServicesRoute,
    servicesLabelName,
    servicesPageRoute,
    servicesSubPageRoute,
} from '../../utils/constants';
import { Link } from 'react-router-dom';

export const servicesMenu = (data: string[]): ItemType => {
    const subMenuItems = data.map((subMenu: string) => {
        const subMenuLabelStr: string =
            subMenu.charAt(0).toUpperCase() + subMenu.substring(1, subMenu.length).replace('_', '');
        return {
            key: servicesSubPageRoute + subMenu,
            label: subMenuLabelStr,
        };
    });

    return {
        key: servicesPageRoute,
        label: servicesLabelName,
        icon: <HddOutlined />,
        children: subMenuItems,
    };
};

export const serviceListMenu = (): ItemType => {
    return {
        key: myServicesRoute,
        label: <Link to={myServicesRoute}>{myServicesLabelName}</Link>,
        icon: <BarsOutlined />,
        title: 'MyServices',
    };
};

export const monitorMenu = (): ItemType => {
    return {
        key: monitorPageRoute,
        label: <Link to={monitorPageRoute}>{monitorLabelName}</Link>,
        icon: <AreaChartOutlined />,
        title: 'Monitor',
    };
};
