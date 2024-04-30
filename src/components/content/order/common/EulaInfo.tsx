/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { Dispatch, SetStateAction } from 'react';
import { Checkbox, Form, Space } from 'antd';
import '../../../../styles/service_order.css';
import { AgreementText } from '../../common/ocl/AgreementText';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

export const EulaInfo = ({
    eula,
    isEulaAccepted,
    setIsEulaAccepted,
}: {
    eula: string | undefined;
    isEulaAccepted: boolean;
    setIsEulaAccepted: Dispatch<SetStateAction<boolean>>;
}): React.JSX.Element => {
    const onChange = (e: CheckboxChangeEvent) => {
        setIsEulaAccepted(e.target.checked);
    };

    return (
        <>
            {eula && eula.length > 0 ? (
                <div className={'cloud-provider-tab-class region-flavor-content'}>
                    <Form.Item
                        name='Terms and Conditions'
                        label='Terms and Conditions'
                        rules={[{ required: true, message: 'Eula needs to be accepted' }]}
                    >
                        <Space wrap>
                            <Checkbox checked={isEulaAccepted} name='isEulaAccepted' onChange={onChange}>
                                I have read and agreed to the <AgreementText eula={eula} /> of the service.
                            </Checkbox>
                        </Space>
                    </Form.Item>
                </div>
            ) : null}
        </>
    );
};
