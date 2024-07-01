/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { DeployRequest, deploy, type DeployData } from '../../../../xpanse-api/generated';

export function useDeployRequestSubmitQuery() {
    return useMutation({
        mutationFn: (createRequest: DeployRequest) => {
            const data: DeployData = { requestBody: createRequest };
            return deploy(data);
        },
    });
}
