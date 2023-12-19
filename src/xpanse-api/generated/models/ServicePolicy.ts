/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ServicePolicy = {
    /**
     * The id of the policy.
     */
    id: string;
    /**
     * The valid policy belongs to the service.
     */
    policy: string;
    /**
     * The id of registered service template which the policy belongs to.
     */
    serviceTemplateId: string;
    /**
     * Is the policy enabled.
     */
    enabled: boolean;
    /**
     * Time of the policy created.
     */
    createTime: string;
    /**
     * Time of the policy updated.
     */
    lastModifiedTime: string;
};