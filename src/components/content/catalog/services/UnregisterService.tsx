/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { MutableRefObject, useRef } from 'react';
import { Button, Popconfirm } from 'antd';
import { ServiceVendorService } from '../../../../xpanse-api/generated';

function UnregisterService({
    id,
    onConfirmHandler,
}: {
    id: string;
    onConfirmHandler: (type: string, message: string, unregisterResult: MutableRefObject<string>, id: string) => void;
}): JSX.Element {
    const unregisterResult = useRef<string>('');
    function unregisterServiceResult(): void {
        ServiceVendorService.unregister(id)
            .then(() => {
                unregisterResult.current = 'completed';
                onConfirmHandler('success', 'Service Unregistered Successfully', unregisterResult, id);
            })
            .catch((error: Error) => {
                unregisterResult.current = 'error';
                onConfirmHandler('error', 'Service Unregister Failed, '.concat(error.message), unregisterResult, id);
            });
    }

    return (
        <div className={'update-unregister-btn-class'}>
            <Popconfirm
                title='Unregister the service'
                description='Are you sure to unregister this service?'
                okText='Yes'
                cancelText='No'
                onConfirm={unregisterServiceResult}
            >
                <Button
                    type='primary'
                    style={{ marginLeft: '50px', marginTop: '20px' }}
                    disabled={unregisterResult.current === 'completed'}
                >
                    Unregister
                </Button>
            </Popconfirm>
        </div>
    );
}
export default UnregisterService;
