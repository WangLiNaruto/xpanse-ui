/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckOutlined, CopyOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input, Typography } from 'antd';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import myServicesStyles from '../../styles/my-services.module.css';
import submitResultStyles from '../../styles/submit-result.module.css';

export function convertMapToDetailsList(content: Map<string, unknown>, title: string): React.JSX.Element {
    if (content.size > 0) {
        const items: React.JSX.Element[] = [];
        const { Paragraph } = Typography;
        content.forEach((v, k) => {
            items.push(
                <li key={k} className={myServicesStyles.detailsContent}>
                    <div className={myServicesStyles.serviceInstanceDetailPosition}>
                        <div className={myServicesStyles.serviceInstanceListDetail}>{k}:&nbsp;&nbsp;</div>
                        {title.includes('Endpoint Information') ? (
                            <div className={myServicesStyles.showDetails}>
                                <Paragraph
                                    copyable={{
                                        text: String(v),
                                        icon: [
                                            <CopyOutlined
                                                className={submitResultStyles.showDetailsTypographyCopy}
                                                key={uuidv4()}
                                            />,
                                            <CheckOutlined
                                                className={submitResultStyles.showDetailsTypographyCopy}
                                                key={uuidv4()}
                                            />,
                                        ],
                                    }}
                                >
                                    <Input.Password
                                        readOnly={true}
                                        variant={'borderless'}
                                        className={myServicesStyles.showDetails}
                                        defaultValue={String(v)}
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </Paragraph>
                            </div>
                        ) : (
                            <div>
                                &nbsp;&nbsp;
                                {String(v)}
                            </div>
                        )}
                    </div>
                </li>
            );
        });

        return (
            <div>
                <h4>{title}</h4>
                <ul>{items}</ul>
            </div>
        );
    }
    return <></>;
}
