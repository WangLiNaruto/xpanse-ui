/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Form, Input, Tooltip } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { DeployParam, TextInputEventHandler } from './CommonTypes';
import { DeployVariable } from '../../../../xpanse-api/generated';

export function TextInput({
    item,
    onChangeHandler,
}: {
    item: DeployParam;
    onChangeHandler: TextInputEventHandler;
}): JSX.Element {
    return (
        <div className={'order-param-item-row'}>
            <div className={'order-param-item-left'} />
            <div className={'order-param-item-content'}>
                <Form.Item
                    name={item.name}
                    label={item.name + ' :  ' + item.description}
                    rules={[{ required: item.mandatory }, { type: 'string', min: 2 }]}
                >
                    {item.sensitiveScope === DeployVariable.sensitiveScope.ALWAYS ||
                    item.sensitiveScope === DeployVariable.sensitiveScope.ONCE ? (
                        <Input.Password
                            name={item.name}
                            placeholder={item.example}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            onChange={onChangeHandler}
                        />
                    ) : (
                        <Input
                            name={item.name}
                            placeholder={item.example}
                            suffix={
                                <Tooltip title={item.description}>
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                            onChange={onChangeHandler}
                        />
                    )}
                </Form.Item>
            </div>
            <div className={'order-param-item-right'} />
        </div>
    );
}
