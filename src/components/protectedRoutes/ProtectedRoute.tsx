/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { env } from '../../config/config.ts';
import { updateApiConfig } from '../../xpanse-api/CustomOpenApiConfig';
import { useCurrentUserRoleStore } from '../layouts/header/useCurrentRoleStore';
import { roles } from '../utils/constants.tsx';
import NotAuthorized from './NotAuthorized.tsx';

interface ProtectedRouteProperties {
    children: React.JSX.Element;
    allowedRole: roles[];
}

function Protected(protectedRouteProperties: ProtectedRouteProperties): React.JSX.Element {
    if (env.VITE_APP_AUTH_DISABLED !== 'true') {
        updateApiConfig();
    }

    const currentRole: string | undefined = useCurrentUserRoleStore((state) => state.currentUserRole);
    const isRoleUpdated: boolean = useCurrentUserRoleStore((state) => state.isRoleUpdated);
    if (currentRole !== undefined && protectedRouteProperties.allowedRole.includes(currentRole as roles)) {
        return protectedRouteProperties.children;
    }
    if (isRoleUpdated) {
        return <Navigate to='/home' replace />;
    }
    return <NotAuthorized />;
}

export default Protected;
