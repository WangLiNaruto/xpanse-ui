/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import { StopwatchResult } from 'react-timer-hook';
import { ServiceProviderContactDetails } from '../../../../xpanse-api/generated';

import React from 'react';
import submitAlertStyles from '../../../../styles/submit-alert.module.css';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import DeploymentTimer from '../orderStatus/DeploymentTimer';
import OrderSubmitResultDetails from '../orderStatus/OrderSubmitResultDetails';

export const PortServiceOrderSubmitResult = ({
    msg,
    serviceId,
    orderId,
    type,
    stopWatch,
    contactServiceDetails,
}: {
    msg: string | React.JSX.Element;
    serviceId: string;
    orderId: string;
    type: 'success' | 'error';
    stopWatch: StopwatchResult;
    contactServiceDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element => {
    return (
        <div className={submitAlertStyles.submitAlertTip}>
            {' '}
            <Alert
                message={`Processing Status`}
                description={<OrderSubmitResultDetails msg={msg} serviceId={serviceId} orderId={orderId} />}
                showIcon
                closable={false}
                type={type}
                action={
                    <>
                        {contactServiceDetails !== undefined ? (
                            <ContactDetailsText
                                serviceProviderContactDetails={contactServiceDetails}
                                showFor={ContactDetailsShowType.Order}
                            />
                        ) : (
                            <></>
                        )}
                        <DeploymentTimer stopWatch={stopWatch} />
                    </>
                }
            />{' '}
        </div>
    );
};
