/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useState } from 'react';
import { Alert, Input, Modal } from 'antd';
import useApproveOrRejectRequest, { ApproveOrRejectRequestParams } from './query/useApproveOrRejectRequest';
import { ApiError, Response, ReviewRegistrationRequest, ServiceTemplateDetailVo } from '../../../xpanse-api/generated';

export const ApproveOrRejectServiceTemplate = ({
    currentServiceTemplateVo,
    isApproved,
    isModalOpen,
    handleModalClose,
    setAlertTipCloseStatus,
}: {
    currentServiceTemplateVo: ServiceTemplateDetailVo | undefined;
    isApproved: boolean | undefined;
    isModalOpen: boolean;
    handleModalClose: (arg: boolean) => void;
    setAlertTipCloseStatus: (arg: boolean) => void;
}): React.JSX.Element => {
    const { TextArea } = Input;
    const [comments, setComments] = useState<string>('');
    const approveOrRejectRequest = useApproveOrRejectRequest();
    const handleOk = () => {
        if (currentServiceTemplateVo && isApproved !== undefined) {
            const request: ApproveOrRejectRequestParams = {
                id: currentServiceTemplateVo.id,
                reviewRegistrationRequest: {
                    reviewResult: isApproved
                        ? ReviewRegistrationRequest.reviewResult.APPROVED
                        : ReviewRegistrationRequest.reviewResult.REJECTED,
                    reviewComment: comments,
                },
            };
            approveOrRejectRequest.mutate(request);
            handleModalClose(true);
            setComments('');
        }
    };

    const handleCancel = () => {
        setComments('');
        handleModalClose(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setComments(e.target.value);
    };

    const onClose = () => {
        setAlertTipCloseStatus(true);
    };

    if (approveOrRejectRequest.isError) {
        let errorMessage;
        if (
            approveOrRejectRequest.error instanceof ApiError &&
            approveOrRejectRequest.error.body &&
            'details' in approveOrRejectRequest.error.body
        ) {
            const response: Response = approveOrRejectRequest.error.body as Response;
            errorMessage = response.details.join();
        } else {
            errorMessage = approveOrRejectRequest.error.message;
        }
        return (
            <div className={'approve-reject-alert-class'}>
                <Alert
                    message={errorMessage}
                    description={'Register service review failed.'}
                    showIcon
                    closable={true}
                    onClose={onClose}
                    type={'error'}
                />
            </div>
        );
    }

    if (approveOrRejectRequest.isSuccess) {
        return (
            <div className={'approve-reject-alert-class'}>
                <Alert
                    message={'Processing Status'}
                    description={'Register service review successfully.'}
                    showIcon
                    closable={true}
                    onClose={onClose}
                    type={'success'}
                />
            </div>
        );
    }

    return (
        <>
            <Modal
                title={isApproved !== undefined && isApproved ? 'Approve' : 'Reject'}
                open={isModalOpen}
                destroyOnClose={true}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <TextArea
                    rows={10}
                    placeholder='Please input your comments.'
                    maxLength={1000}
                    value={comments}
                    onChange={handleChange}
                />
            </Modal>
        </>
    );
};
