/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { DeployedService } from '../../../../xpanse-api/generated';
import { Skeleton } from 'antd';
import ServicesLoadingError from '../query/ServicesLoadingError';
import userOrderableServicesQuery from '../query/userOrderableServicesQuery';
import '../../../../styles/service_order.css';
import { SelectServiceForm } from './SelectServiceForm';

function CreateService(): React.JSX.Element {
    const [urlParams] = useSearchParams();
    const serviceName = decodeURI(urlParams.get('serviceName') ?? '');
    const categoryName = decodeURI(urlParams.get('catalog') ?? '');
    const orderableServicesQuery = userOrderableServicesQuery(categoryName as DeployedService.category, serviceName);

    if (orderableServicesQuery.isSuccess) {
        return <SelectServiceForm services={orderableServicesQuery.data} />;
    }

    if (orderableServicesQuery.isError) {
        return <ServicesLoadingError error={orderableServicesQuery.error} />;
    }

    if (orderableServicesQuery.isLoading || orderableServicesQuery.isFetching) {
        return (
            <Skeleton
                className={'catalog-skeleton'}
                active={true}
                paragraph={{ rows: 2, width: ['20%', '20%'] }}
                title={{ width: '5%' }}
            />
        );
    }

    return <></>;
}

export default CreateService;
