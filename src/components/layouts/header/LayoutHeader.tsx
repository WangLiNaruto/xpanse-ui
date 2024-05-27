/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useOidcIdToken } from '@axa-fr/react-oidc';
import { OidcIdToken } from '@axa-fr/react-oidc/dist/ReactOidc';
import { Space } from 'antd';
import { Header } from 'antd/es/layout/layout';
import React from 'react';
import appStyles from '../../../styles/app.module.css';
import SystemStatusBar from '../../content/systemStatus/SystemStatusBar';
import { HeaderUserRoles } from './HeaderUserRoles';

function LayoutHeader(): React.JSX.Element {
    const oidcIdToken: OidcIdToken = useOidcIdToken();
    return (
        <Header style={{ width: '100%', background: '#ffffff' }}>
            <div className={appStyles.headerMenu}>
                <Space align='baseline'>
                    <SystemStatusBar />
                    {oidcIdToken.idToken ? (
                        <HeaderUserRoles oidcIdToken={oidcIdToken} key={oidcIdToken.idToken as string} />
                    ) : null}
                </Space>
            </div>
        </Header>
    );
}

export default LayoutHeader;
