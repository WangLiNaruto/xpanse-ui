/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { Button, Form, Space, Switch } from 'antd';
import '../../../../styles/locks.css';
import {
    DeployedServiceDetails,
    ServiceLockConfig,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import LocksResult from './LocksResult';
import { useLockRequest } from './useLockRequest';

export const Locks = ({
    currentSelectedService,
}: {
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element => {
    const [form] = Form.useForm();

    const lockRequest = useLockRequest(currentSelectedService.id);

    const onFinish = (values: { destroyChecked: boolean; modifyChecked: boolean }) => {
        const serviceLockConfig: { id: string; lockConfig: ServiceLockConfig } = {
            id: currentSelectedService.id,
            lockConfig: {
                destroyLocked: values.destroyChecked,
                modifyLocked: values.modifyChecked,
            },
        };
        lockRequest.mutate(serviceLockConfig);
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <div className={'locks-select-class'}>
            {currentSelectedService.lockConfig !== undefined && !lockRequest.isPending && !lockRequest.isIdle ? (
                <LocksResult currentSelectedService={currentSelectedService} />
            ) : null}
            <div className={'locks-param-item-left'} />
            <Form
                form={form}
                layout='horizontal'
                initialValues={{
                    destroyChecked:
                        currentSelectedService.lockConfig !== undefined
                            ? currentSelectedService.lockConfig.destroyLocked
                            : false,
                    modifyChecked:
                        currentSelectedService.lockConfig !== undefined
                            ? currentSelectedService.lockConfig.modifyLocked
                            : false,
                }}
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                disabled={lockRequest.isSuccess}
            >
                <Form.Item label='Destroy Lock:' name='destroyChecked' valuePropName='destroyChecked'>
                    <Switch
                        defaultValue={
                            currentSelectedService.lockConfig !== undefined
                                ? currentSelectedService.lockConfig.destroyLocked
                                : false
                        }
                    />
                </Form.Item>
                <Form.Item label='Modify Lock:' name='modifyChecked' valuePropName='modifyChecked'>
                    <Switch
                        defaultValue={
                            currentSelectedService.lockConfig !== undefined
                                ? currentSelectedService.lockConfig.modifyLocked
                                : false
                        }
                    />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type='primary' htmlType='submit' loading={lockRequest.isPending}>
                            Submit
                        </Button>
                        <Button htmlType='button' onClick={onReset}>
                            Reset
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};
