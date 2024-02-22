/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { To, useLocation, useSearchParams } from 'react-router-dom';
import { Billing, ServiceProviderContactDetails, UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import NavigateOrderSubmission from './NavigateOrderSubmission';
import CspSelect from '../formElements/CspSelect';
import GoToSubmit from './GoToSubmit';
import { Col, Form, Row, Select, Skeleton, Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import { servicesSubPageRoute } from '../../../utils/constants';
import { OrderSubmitProps } from './OrderSubmit';
import ServicesLoadingError from '../query/ServicesLoadingError';
import userOrderableServicesQuery from '../query/userOrderableServicesQuery';
import { ServiceHostingSelection } from '../common/ServiceHostingSelection';
import { convertAreasToTabs } from '../formDataHelpers/areaHelper';
import { getRegionDropDownValues } from '../formDataHelpers/regionHelper';
import { Region } from '../types/Region';
import { getFlavorList } from '../formDataHelpers/flavorHelper';
import { Flavor } from '../types/Flavor';
import { getSortedVersionList } from '../formDataHelpers/versionHelper';
import { getAvailableServiceHostingTypes } from '../formDataHelpers/serviceHostingTypeHelper';
import { getCspListForVersion } from '../formDataHelpers/cspHelper';
import { getBilling } from '../formDataHelpers/billingHelper';
import '../../../../styles/service_order.css';
import { BillingInfo } from '../common/BillingInfo';
import { RegionInfo } from '../common/RegionInfo';
import { FlavorInfo } from '../common/FlavorInfo';
import { getContactServiceDetailsOfServiceByCsp } from '../formDataHelpers/contactServiceDetailsHelper';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';

function CreateService(): React.JSX.Element {
    const [urlParams] = useSearchParams();
    const location = useLocation();
    const latestVersion = decodeURI(urlParams.get('latestVersion') ?? '');
    const categoryName = decodeURI(urlParams.get('catalog') ?? '');
    const serviceName = decodeURI(urlParams.get('serviceName') ?? '');
    const versionMapper = useRef<Map<string, UserOrderableServiceVo[]>>(new Map<string, UserOrderableServiceVo[]>());
    const [versionList, setVersionList] = useState<{ value: string; label: string }[]>([{ value: '', label: '' }]);
    const [selectVersion, setSelectVersion] = useState<string>('');

    const [selectCsp, setSelectCsp] = useState<UserOrderableServiceVo.csp | undefined>(undefined);
    const [cspList, setCspList] = useState<UserOrderableServiceVo.csp[]>([]);

    const [areaList, setAreaList] = useState<Tab[]>([]);
    const [selectArea, setSelectArea] = useState<string>('');

    const [regionList, setRegionList] = useState<Region[]>([]);
    const [selectRegion, setSelectRegion] = useState<string>('');

    const [flavorList, setFlavorList] = useState<Flavor[]>([]);
    const [selectFlavor, setSelectFlavor] = useState<string>('');
    const [priceValue, setPriceValue] = useState<string>('');
    const [currentBilling, setCurrentBilling] = useState<Billing | undefined>(undefined);
    const [selectServiceHostType, setSelectServiceHostType] = useState<
        UserOrderableServiceVo.serviceHostingType | undefined
    >(undefined);
    const [serviceHostTypes, setServiceHostTypes] = useState<UserOrderableServiceVo.serviceHostingType[]>([]);
    const [currentServiceProviderContactDetails, setCurrentServiceProviderContactDetails] = useState<
        ServiceProviderContactDetails | undefined
    >(undefined);

    const orderableServicesQuery = userOrderableServicesQuery(
        categoryName as UserOrderableServiceVo.category,
        serviceName
    );

    useEffect(() => {
        if (orderableServicesQuery.isSuccess) {
            const services: UserOrderableServiceVo[] | undefined = orderableServicesQuery.data;
            if (services.length > 0) {
                const currentVersions: Map<string, UserOrderableServiceVo[]> = new Map<
                    string,
                    UserOrderableServiceVo[]
                >();
                for (const service of services) {
                    if (service.version) {
                        if (!currentVersions.has(service.version)) {
                            currentVersions.set(
                                service.version,
                                services.filter((data) => data.version === service.version)
                            );
                        }
                    }
                }
                versionMapper.current = currentVersions;
                const currentVersionList = getSortedVersionList(currentVersions);
                const currentCspList = getCspListForVersion(latestVersion, versionMapper.current);
                let serviceHostingTypes = getAvailableServiceHostingTypes(
                    currentCspList[0],
                    versionMapper.current.get(latestVersion)
                );
                let contactServiceDetails = getContactServiceDetailsOfServiceByCsp(
                    currentCspList[0],
                    versionMapper.current.get(latestVersion)
                );
                let currentFlavorList = getFlavorList(
                    currentCspList[0],
                    serviceHostingTypes[0],
                    versionMapper.current.get(latestVersion)
                );
                setVersionList(currentVersionList);
                setSelectVersion(latestVersion);
                setCspList(currentCspList);
                setFlavorList(currentFlavorList);
                let currentAreaList: Tab[] = convertAreasToTabs(
                    currentCspList[0],
                    serviceHostingTypes[0],
                    versionMapper.current.get(latestVersion)
                );
                let currentRegionList: Region[] = getRegionDropDownValues(
                    currentCspList[0],
                    serviceHostingTypes[0],
                    currentAreaList[0]?.key ?? '',
                    versionMapper.current.get(latestVersion)
                );
                let currentBilling = getBilling(
                    currentCspList[0],
                    serviceHostingTypes[0],
                    versionMapper.current.get(latestVersion)
                );
                let cspValue: UserOrderableServiceVo.csp = currentCspList[0];
                let areaValue: string = currentAreaList[0]?.key ?? '';
                let regionValue: string = currentRegionList[0]?.value ?? '';
                let flavorValue: string = currentFlavorList[0]?.value ?? '';
                let priceValue: string = currentFlavorList[0]?.price ?? '';
                let serviceHostingTypeValue = selectServiceHostType ?? serviceHostingTypes[0];
                if (location.state) {
                    const serviceInfo: OrderSubmitProps = location.state as OrderSubmitProps;
                    serviceHostingTypes = getAvailableServiceHostingTypes(
                        serviceInfo.csp,
                        versionMapper.current.get(serviceInfo.version)
                    );
                    currentAreaList = convertAreasToTabs(
                        serviceInfo.csp,
                        serviceInfo.serviceHostingType,
                        versionMapper.current.get(serviceInfo.version)
                    );
                    currentRegionList = getRegionDropDownValues(
                        serviceInfo.csp,
                        serviceInfo.serviceHostingType,
                        serviceInfo.area,
                        versionMapper.current.get(serviceInfo.version)
                    );
                    currentFlavorList = getFlavorList(
                        serviceInfo.csp,
                        serviceInfo.serviceHostingType,
                        versionMapper.current.get(serviceInfo.version)
                    );
                    currentBilling = getBilling(
                        serviceInfo.csp,
                        serviceInfo.serviceHostingType,
                        versionMapper.current.get(serviceInfo.version)
                    );
                    cspValue = serviceInfo.csp;
                    areaValue = serviceInfo.area;
                    regionValue = serviceInfo.region;
                    flavorValue = serviceInfo.flavor;
                    currentFlavorList.forEach((flavorItem) => {
                        if (flavorItem.value === serviceInfo.flavor) {
                            priceValue = flavorItem.price;
                        }
                    });
                    serviceHostingTypeValue = serviceInfo.serviceHostingType;
                    contactServiceDetails = serviceInfo.contactServiceDetails ?? undefined;
                }
                setSelectCsp(cspValue);
                setAreaList(currentAreaList);
                setSelectArea(areaValue);
                setRegionList(currentRegionList);
                setSelectRegion(regionValue);
                setSelectFlavor(flavorValue);
                setPriceValue(priceValue);
                setCurrentBilling(currentBilling);
                setSelectServiceHostType(serviceHostingTypeValue);
                setServiceHostTypes(serviceHostingTypes);
                setCurrentServiceProviderContactDetails(contactServiceDetails);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderableServicesQuery.isSuccess, orderableServicesQuery.data, latestVersion, serviceName]);

    useEffect(() => {
        if (selectCsp && selectServiceHostType && !location.state) {
            const currentAreaList = convertAreasToTabs(
                selectCsp,
                selectServiceHostType,
                versionMapper.current.get(selectVersion)
            );
            const currentRegionList = getRegionDropDownValues(
                selectCsp,
                selectServiceHostType,
                currentAreaList[0]?.key ?? '',
                versionMapper.current.get(selectVersion)
            );
            const currentFlavorList = getFlavorList(
                selectCsp,
                selectServiceHostType,
                versionMapper.current.get(selectVersion)
            );
            const billing: Billing = getBilling(
                selectCsp,
                selectServiceHostType,
                versionMapper.current.get(selectVersion)
            );
            setAreaList(currentAreaList);
            setSelectArea(currentAreaList[0]?.key ?? '');
            setRegionList(currentRegionList);
            setSelectRegion(currentRegionList[0]?.value ?? '');
            setFlavorList(currentFlavorList);
            setSelectFlavor(currentFlavorList[0]?.value ?? '');
            setPriceValue(currentFlavorList[0]?.price);
            setCurrentBilling(billing);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectServiceHostType]);

    const onChangeVersion = (currentVersion: string) => {
        const currentCspList = getCspListForVersion(currentVersion, versionMapper.current);
        if (selectServiceHostType) {
            const currentAreaList = convertAreasToTabs(
                currentCspList[0],
                selectServiceHostType,
                versionMapper.current.get(currentVersion)
            );
            const currentRegionList = getRegionDropDownValues(
                currentCspList[0],
                selectServiceHostType,
                currentAreaList[0]?.key ?? '',
                versionMapper.current.get(currentVersion)
            );
            const currentFlavorList = getFlavorList(
                currentCspList[0],
                selectServiceHostType,
                versionMapper.current.get(currentVersion)
            );
            const serviceHostingTypes = getAvailableServiceHostingTypes(
                currentCspList[0],
                versionMapper.current.get(currentVersion)
            );
            const billing: Billing = getBilling(
                currentCspList[0],
                serviceHostingTypes[0],
                versionMapper.current.get(currentVersion)
            );
            const contactServiceDetails: ServiceProviderContactDetails | undefined =
                getContactServiceDetailsOfServiceByCsp(currentCspList[0], versionMapper.current.get(currentVersion));
            setSelectVersion(currentVersion);
            setCspList(currentCspList);
            setSelectCsp(currentCspList[0]);
            setAreaList(currentAreaList);
            setSelectArea(currentAreaList[0]?.key ?? '');
            setRegionList(currentRegionList);
            setSelectRegion(currentRegionList[0]?.value ?? '');
            setFlavorList(currentFlavorList);
            setSelectFlavor(currentFlavorList[0]?.value ?? '');
            setPriceValue(currentFlavorList[0]?.price);
            setCurrentBilling(billing);
            setServiceHostTypes(serviceHostingTypes);
            setSelectServiceHostType(serviceHostingTypes[0]);
            setCurrentServiceProviderContactDetails(contactServiceDetails);
        }
    };

    const onChangeCloudProvider = (csp: UserOrderableServiceVo.csp) => {
        if (selectServiceHostType) {
            const currentAreaList = convertAreasToTabs(
                csp,
                selectServiceHostType,
                versionMapper.current.get(selectVersion)
            );
            const currentRegionList = getRegionDropDownValues(
                csp,
                selectServiceHostType,
                currentAreaList[0]?.key ?? '',
                versionMapper.current.get(selectVersion)
            );
            const currentFlavorList = getFlavorList(
                csp,
                selectServiceHostType,
                versionMapper.current.get(selectVersion)
            );
            const serviceHostingTypes = getAvailableServiceHostingTypes(csp, versionMapper.current.get(selectVersion));
            const billing: Billing = getBilling(csp, selectServiceHostType, versionMapper.current.get(selectVersion));
            const contactServiceDetails: ServiceProviderContactDetails | undefined =
                getContactServiceDetailsOfServiceByCsp(csp, versionMapper.current.get(selectVersion));
            setSelectCsp(csp);
            setAreaList(currentAreaList);
            setSelectArea(currentAreaList[0]?.key ?? '');
            setRegionList(currentRegionList);
            setSelectRegion(currentRegionList[0]?.value ?? '');
            setFlavorList(currentFlavorList);
            setSelectFlavor(currentFlavorList[0]?.value ?? '');
            setPriceValue(currentFlavorList[0]?.price);
            setCurrentBilling(billing);
            setSelectServiceHostType(serviceHostingTypes[0]);
            setServiceHostTypes(serviceHostingTypes);
            setCurrentServiceProviderContactDetails(contactServiceDetails);
        }
    };

    const onChangeAreaValue = (newArea: string) => {
        setSelectArea(newArea);
        if (selectCsp && selectServiceHostType) {
            const currentRegionList = getRegionDropDownValues(
                selectCsp,
                selectServiceHostType,
                newArea,
                versionMapper.current.get(selectVersion)
            );
            setRegionList(currentRegionList);
            setSelectRegion(currentRegionList[0]?.value ?? '');
        }
    };

    const onChangeRegion = (value: string) => {
        setSelectRegion(value);
    };

    const onChangeFlavor = (newFlavor: string) => {
        setSelectFlavor(newFlavor);
        if (selectCsp && selectServiceHostType) {
            const billing: Billing = getBilling(
                selectCsp,
                selectServiceHostType,
                versionMapper.current.get(selectVersion)
            );
            flavorList.forEach((flavor) => {
                if (newFlavor === flavor.value) {
                    setPriceValue(flavor.price);
                }
            });
            setCurrentBilling(billing);
        }
    };

    const onChangeServiceHostingType = (serviceHostingType: UserOrderableServiceVo.serviceHostingType) => {
        location.state = undefined;
        setSelectServiceHostType(serviceHostingType);
    };

    const servicePageUrl = servicesSubPageRoute + categoryName;

    if (orderableServicesQuery.isError) {
        versionMapper.current = new Map<string, UserOrderableServiceVo[]>();
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

    if (selectCsp) {
        return (
            <>
                <Form layout='vertical' initialValues={{ selectRegion, selectFlavor }}>
                    <div>
                        <NavigateOrderSubmission text={'<< Back'} to={servicePageUrl as To} props={undefined} />
                        <div className={'Line'} />
                    </div>
                    <div className={'generic-table-container'}>
                        <Row justify='start' gutter={10}>
                            <Col span={4}>
                                <div className={'content-title'}>Service: {serviceName}</div>
                            </Col>
                            <Col span={6}>
                                <div className={'content-title'}>
                                    Version:&nbsp;
                                    <Select
                                        value={selectVersion}
                                        className={'version-drop-down'}
                                        onChange={onChangeVersion}
                                        options={versionList}
                                    />
                                </div>
                            </Col>
                            {currentServiceProviderContactDetails !== undefined ? (
                                <Col span={4}>
                                    <ContactDetailsText
                                        serviceProviderContactDetails={currentServiceProviderContactDetails}
                                        showFor={ContactDetailsShowType.Order}
                                    />
                                </Col>
                            ) : (
                                <></>
                            )}
                        </Row>

                        <br />
                        <CspSelect
                            selectCsp={selectCsp}
                            cspList={cspList}
                            onChangeHandler={(csp: UserOrderableServiceVo.csp) => {
                                onChangeCloudProvider(csp);
                            }}
                        />
                        <br />
                        <ServiceHostingSelection
                            serviceHostingTypes={serviceHostTypes}
                            updateServiceHostingType={onChangeServiceHostingType}
                            disabledAlways={false}
                            previousSelection={selectServiceHostType}
                        ></ServiceHostingSelection>
                        <br />
                        <br />
                        <div className={'cloud-provider-tab-class content-title'}>
                            <Tabs
                                type='card'
                                size='middle'
                                activeKey={selectArea}
                                tabPosition={'top'}
                                items={areaList}
                                onChange={(area) => {
                                    onChangeAreaValue(area);
                                }}
                            />
                        </div>
                        <RegionInfo
                            selectRegion={selectRegion}
                            onChangeRegion={onChangeRegion}
                            regionList={regionList}
                        />
                        <FlavorInfo
                            selectFlavor={selectFlavor}
                            flavorList={flavorList}
                            onChangeFlavor={onChangeFlavor}
                        />
                        <BillingInfo priceValue={priceValue} billing={currentBilling} />
                    </div>
                    {selectServiceHostType ? (
                        <div>
                            <div className={'Line'} />
                            <GoToSubmit
                                selectedVersion={selectVersion}
                                selectedCsp={selectCsp}
                                selectedRegion={selectRegion}
                                selectedArea={selectArea}
                                selectedFlavor={selectFlavor}
                                versionMapper={versionMapper.current}
                                selectedServiceHostingType={selectServiceHostType}
                                currentServiceProviderContactDetails={currentServiceProviderContactDetails}
                            />
                        </div>
                    ) : null}
                </Form>
            </>
        );
    }

    return <></>;
}

export default CreateService;
