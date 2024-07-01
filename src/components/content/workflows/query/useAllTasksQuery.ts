/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { queryTasks, QueryTasksData } from '../../../../xpanse-api/generated';

export default function useAllTasksQuery(status: 'done' | 'failed' | undefined) {
    return useQuery({
        queryKey: ['allTasks', status],
        queryFn: () => {
            const data: QueryTasksData = {
                status: status,
            };
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
            return queryTasks(data);
        },
    });
}
