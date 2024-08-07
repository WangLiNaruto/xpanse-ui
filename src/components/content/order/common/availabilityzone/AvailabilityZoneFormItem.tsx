/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Form } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../../styles/service-order.module.css';
import { AvailabilityZoneConfig, csp } from '../../../../../xpanse-api/generated';
import useGetAvailabilityZonesForRegionQuery from '../utils/useGetAvailabilityZonesForRegionQuery';
import { AvailabilityZoneButton } from './AvailabilityZoneButton';
import { AvailabilityZoneError } from './AvailabilityZoneError';
import { AvailabilityZoneLoading } from './AvailabilityZoneLoading';

export function AvailabilityZoneFormItem({
    availabilityZoneConfig,
    selectRegion,
    onAvailabilityZoneChange,
    selectAvailabilityZones,
    selectCsp,
}: {
    availabilityZoneConfig: AvailabilityZoneConfig;
    selectRegion: string;
    onAvailabilityZoneChange: (varName: string, availabilityZone: string | undefined) => void;
    selectAvailabilityZones: Record<string, string | undefined>;
    selectCsp: csp;
}): React.JSX.Element {
    const availabilityZonesVariableRequest = useGetAvailabilityZonesForRegionQuery(selectCsp, selectRegion);
    const retryRequest = () => {
        if (availabilityZonesVariableRequest.isError) {
            void availabilityZonesVariableRequest.refetch();
        }
    };

    function getFormContent() {
        if (availabilityZonesVariableRequest.isLoading || availabilityZonesVariableRequest.isFetching) {
            return <AvailabilityZoneLoading key={availabilityZoneConfig.varName} />;
        }
        if (availabilityZonesVariableRequest.isError) {
            return (
                <AvailabilityZoneError
                    isAvailabilityZoneMandatory={availabilityZoneConfig.mandatory}
                    retryRequest={retryRequest}
                    error={availabilityZonesVariableRequest.error}
                />
            );
        }
        if (availabilityZonesVariableRequest.data) {
            return (
                <AvailabilityZoneButton
                    availabilityZoneConfig={availabilityZoneConfig}
                    selectRegion={selectRegion}
                    availabilityZones={availabilityZonesVariableRequest.data}
                    onAvailabilityZoneChange={onAvailabilityZoneChange}
                    selectAvailabilityZones={selectAvailabilityZones}
                />
            );
        }
        return null;
    }

    return (
        <div className={serviceOrderStyles.orderFormSelectionFirstInGroup}>
            <Form.Item
                key={availabilityZoneConfig.varName}
                label={
                    <p
                        className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                    >
                        {availabilityZoneConfig.displayName}
                    </p>
                }
                labelCol={{ span: 2, style: { textAlign: 'left' } }}
                required={availabilityZoneConfig.mandatory}
                rules={[
                    {
                        required: availabilityZoneConfig.mandatory,
                        message: availabilityZoneConfig.displayName + 'is required',
                    },
                    { type: 'string' },
                ]}
            >
                {getFormContent()}
            </Form.Item>
        </div>
    );
}
