/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import {
    AreaChartOutlined,
    AuditOutlined,
    BarsOutlined,
    BranchesOutlined,
    CloudServerOutlined,
    DashboardOutlined,
    HddOutlined,
    SafetyOutlined,
    VerifiedOutlined,
} from '@ant-design/icons';
import { ItemType } from 'antd/es/menu/interface';
import { Link } from 'react-router-dom';
import {
    credentialLabelName,
    credentialPageRoute,
    healthCheckLabelName,
    healthCheckPageRoute,
    monitorLabelName,
    monitorPageRoute,
    myServicesLabelName,
    myServicesRoute,
    policiesLabelName,
    policiesRoute,
    registeredServicesLabelName,
    registeredServicesPageRoute,
    reportsLabelName,
    reportsRoute,
    serviceReviewsLabelName,
    serviceReviewsPageRoute,
    servicesLabelName,
    servicesPageRoute,
    servicesSubPageRoute,
    workflowsLabelName,
    workflowsPageRoute,
} from '../../utils/constants';

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

export const myServicesMenu = (): ItemType => {
    return {
        key: myServicesRoute,
        label: <Link to={myServicesRoute}>{myServicesLabelName}</Link>,
        icon: <CloudServerOutlined />,
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

export const credentialMenu = (): ItemType => {
    return {
        key: credentialPageRoute,
        label: <Link to={credentialPageRoute}>{credentialLabelName}</Link>,
        icon: <VerifiedOutlined />,
        title: 'Credentials',
    };
};

export const healthCheckMenu = (): ItemType => {
    return {
        key: healthCheckPageRoute,
        label: <Link to={healthCheckPageRoute}>{healthCheckLabelName}</Link>,
        icon: <DashboardOutlined />,
        title: 'HealthCheck',
    };
};

export const policiesMenu = (): ItemType => {
    return {
        key: policiesRoute,
        label: <Link to={policiesRoute}>{policiesLabelName}</Link>,
        icon: <SafetyOutlined />,
        title: 'Policies',
    };
};

export const reportsMenu = (): ItemType => {
    return {
        key: reportsRoute,
        label: <Link to={reportsRoute}>{reportsLabelName}</Link>,
        icon: <CloudServerOutlined />,
        title: 'Policies',
    };
};

export const workflowsMenu = (): ItemType => {
    return {
        key: workflowsPageRoute,
        label: <Link to={workflowsPageRoute}>{workflowsLabelName}</Link>,
        icon: <BranchesOutlined />,
        title: 'Workflows',
    };
};

export const serviceReviewsMenu = (): ItemType => {
    return {
        key: serviceReviewsPageRoute,
        label: <Link to={serviceReviewsPageRoute}>{serviceReviewsLabelName}</Link>,
        icon: <AuditOutlined />,
        title: 'ReviewService',
    };
};

export const registeredServicesMenu = (): ItemType => {
    return {
        key: registeredServicesPageRoute,
        label: <Link to={registeredServicesPageRoute}>{registeredServicesLabelName}</Link>,
        icon: <BarsOutlined />,
        title: 'RegisteredServices',
    };
};
