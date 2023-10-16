/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { To, useLocation, useSearchParams } from 'react-router-dom';
import {
    Billing,
    CloudServiceProvider,
    FlavorBasic,
    Region,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import NavigateOrderSubmission from './NavigateOrderSubmission';
import CspSelect from '../formElements/CspSelect';
import GoToSubmit from '../formElements/GoToSubmit';
import { Select, Skeleton, Space, Tabs } from 'antd';
import { Area } from '../../../utils/Area';
import { Tab } from 'rc-tabs/lib/interface';
import { sortVersion } from '../../../utils/Sort';
import { currencyMapper } from '../../../utils/currency';
import { servicesSubPageRoute } from '../../../utils/constants';
import { OrderSubmitProps } from './OrderSubmit';
import ServicesLoadingError from '../query/ServicesLoadingError';
import userOrderableServicesQuery from '../query/userOrderableServicesQuery';

function filterAreaList(
    selectVersion: string,
    selectCsp: string,
    versionMapper: Map<string, UserOrderableServiceVo[]>
): Area[] {
    const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
    versionMapper.forEach((v, k) => {
        if (k !== selectVersion) {
            return [];
        }
        for (const userOrderableServiceVo of v) {
            if (userOrderableServiceVo.csp.valueOf() === selectCsp) {
                const areaRegions: Map<string, Region[]> = new Map<string, Region[]>();
                for (const region of userOrderableServiceVo.regions) {
                    if (region.area && !areaRegions.has(region.area)) {
                        areaRegions.set(
                            region.area,
                            userOrderableServiceVo.regions.filter((data) => data.area === region.area)
                        );
                    }
                }
                const areas: Area[] = [];
                areaRegions.forEach((areaRegions, area) => {
                    const regionNames: string[] = [];
                    areaRegions.forEach((region) => {
                        if (region.name) {
                            regionNames.push(region.name);
                        }
                    });
                    areas.push({ name: area, regions: regionNames });
                });
                areaMapper.set(userOrderableServiceVo.csp, areas);
            }
        }
    });
    return areaMapper.get(selectCsp) ?? [];
}

function filterFlavorList(
    selectVersion: string,
    selectCsp: string,
    versionMapper: Map<string, UserOrderableServiceVo[]>
): Map<string, FlavorBasic[]> {
    const flavorMapper: Map<string, FlavorBasic[]> = new Map<string, FlavorBasic[]>();
    versionMapper.forEach((v, k) => {
        if (k !== selectVersion) {
            return new Map<string, FlavorBasic[]>();
        }
        for (const userOrderableServiceVo of v) {
            if (userOrderableServiceVo.csp.valueOf() === selectCsp) {
                flavorMapper.set(userOrderableServiceVo.csp, userOrderableServiceVo.flavors);
            }
        }
    });
    return flavorMapper;
}

function CreateService(): React.JSX.Element {
    const [urlParams] = useSearchParams();
    const location = useLocation();
    const latestVersion = decodeURI(urlParams.get('latestVersion') ?? '');
    const categoryName = decodeURI(urlParams.get('catalog') ?? '');
    const serviceName = decodeURI(urlParams.get('serviceName') ?? '');
    const versionMapper = useRef<Map<string, UserOrderableServiceVo[]>>(new Map<string, UserOrderableServiceVo[]>());
    const [versionList, setVersionList] = useState<{ value: string; label: string }[]>([{ value: '', label: '' }]);
    const [selectVersion, setSelectVersion] = useState<string>('');

    const [selectCsp, setSelectCsp] = useState<CloudServiceProvider.name | undefined>(undefined);
    const [cspList, setCspList] = useState<CloudServiceProvider.name[]>([]);

    const [areaList, setAreaList] = useState<Tab[]>([{ key: '', label: '' }]);
    const [selectArea, setSelectArea] = useState<string>('');

    const [regionList, setRegionList] = useState<{ value: string; label: string }[]>([{ value: '', label: '' }]);
    const [selectRegion, setSelectRegion] = useState<string>('');

    const [flavorList, setFlavorList] = useState<{ value: string; label: string; price: string }[]>([
        { value: '', label: '', price: '' },
    ]);
    const [selectFlavor, setSelectFlavor] = useState<string>('');
    const [priceValue, setPriceValue] = useState<string>('');
    const [currency, setCurrency] = useState<string>('');

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
                for (const registerServiceEntity of services) {
                    if (registerServiceEntity.version) {
                        if (!currentVersions.has(registerServiceEntity.version)) {
                            currentVersions.set(
                                registerServiceEntity.version,
                                services.filter((data) => data.version === registerServiceEntity.version)
                            );
                        }
                    }
                }
                versionMapper.current = currentVersions;
                const currentVersionList = getVersionList(currentVersions);
                const currentCspList = getCspList(latestVersion);
                let currentFlavorList = getFlavorList(latestVersion, currentCspList[0]);
                setVersionList(currentVersionList);
                setSelectVersion(latestVersion);
                setCspList(currentCspList);
                setFlavorList(currentFlavorList);
                let currentAreaList: Tab[] = getAreaList(latestVersion, currentCspList[0]);
                let currentRegionList: { value: string; label: string }[] = getRegionList(
                    latestVersion,
                    currentCspList[0],
                    currentAreaList[0]?.key ?? ''
                );
                let currentBilling = getBilling(latestVersion, currentCspList[0]);
                let cspValue: CloudServiceProvider.name = currentCspList[0];
                let areaValue: string = currentAreaList[0]?.key ?? '';
                let regionValue: string = currentRegionList[0]?.value ?? '';
                let flavorValue: string = currentFlavorList[0]?.value ?? '';
                let priceValue: string = currentFlavorList[0]?.price ?? '';
                if (location.state) {
                    const serviceInfo: OrderSubmitProps = location.state as OrderSubmitProps;
                    currentAreaList = getAreaList(serviceInfo.version, serviceInfo.csp);
                    currentRegionList = getRegionList(serviceInfo.version, serviceInfo.csp, serviceInfo.area);
                    currentFlavorList = getFlavorList(serviceInfo.version, serviceInfo.csp.toString());
                    currentBilling = getBilling(serviceInfo.version, serviceInfo.csp.toString());
                    cspValue = serviceInfo.csp as unknown as CloudServiceProvider.name;
                    areaValue = serviceInfo.area;
                    regionValue = serviceInfo.region;
                    flavorValue = serviceInfo.flavor;
                    currentFlavorList.forEach((flavorItem) => {
                        if (flavorItem.value === serviceInfo.flavor) {
                            priceValue = flavorItem.price;
                        }
                    });
                }
                const currencyValue: string = currencyMapper[currentBilling.currency];
                setSelectCsp(cspValue);
                setAreaList(currentAreaList);
                setSelectArea(areaValue);
                setRegionList(currentRegionList);
                setSelectRegion(regionValue);
                setSelectFlavor(flavorValue);
                setPriceValue(priceValue);
                setCurrency(currencyValue);
            }
        }
    }, [orderableServicesQuery.isSuccess, orderableServicesQuery.data, latestVersion, location.state, serviceName]);

    function getVersionList(
        currentVersions: Map<string, UserOrderableServiceVo[]>
    ): { value: string; label: string }[] {
        if (currentVersions.size <= 0) {
            return [{ value: '', label: '' }];
        }
        const versionSet: string[] = Array.from(currentVersions.keys());
        const versions: { value: string; label: string }[] = [];
        sortVersion(versionSet).forEach((version) => {
            versionMapper.current.forEach((v, k) => {
                if (version === k) {
                    const versionItem = { value: k || '', label: k || '' };
                    versions.push(versionItem);
                }
            });
        });

        return versions;
    }

    function getCspList(selectVersion: string): CloudServiceProvider.name[] {
        const cspList: CloudServiceProvider.name[] = [];

        versionMapper.current.forEach((v, k) => {
            if (k === selectVersion) {
                for (const userOrderableServiceVo of v) {
                    cspList.push(userOrderableServiceVo.csp as unknown as CloudServiceProvider.name);
                }
            }
        });
        return cspList;
    }

    function getAreaList(selectVersion: string, selectCsp: string): Tab[] {
        const areaList: Area[] = filterAreaList(selectVersion, selectCsp, versionMapper.current);
        let areaItems: Tab[] = [];
        if (areaList.length > 0) {
            areaItems = areaList.map((area: Area) => {
                if (!area.name) {
                    return { key: '', label: '' };
                }
                const name = area.name;
                return {
                    label: name,
                    key: name,
                    children: [],
                };
            });
        }
        return areaItems;
    }

    function getRegionList(
        selectVersion: string,
        selectCsp: string,
        selectArea: string
    ): { value: string; label: string }[] {
        const areaList: Area[] = filterAreaList(selectVersion, selectCsp, versionMapper.current);
        let regions: { value: string; label: string }[] = [];
        if (areaList.length > 0) {
            regions = areaList
                .filter((v) => v.name === selectArea)
                .flatMap((v) => {
                    return v.regions.map((region) => {
                        if (!region) {
                            return { value: '', label: '' };
                        }
                        return {
                            value: region,
                            label: region,
                        };
                    });
                });
        }
        return regions;
    }

    function getFlavorList(
        selectVersion: string,
        selectCsp: string
    ): { value: string; label: string; price: string }[] {
        const flavorMapper = filterFlavorList(selectVersion, selectCsp, versionMapper.current);

        const flavorList = flavorMapper.get(selectCsp) ?? [];
        const flavors: { value: string; label: string; price: string }[] = [];
        if (flavorList.length > 0) {
            for (const flavor of flavorList) {
                const flavorItem = { value: flavor.name, label: flavor.name, price: flavor.fixedPrice.toString() };
                flavors.push(flavorItem);
            }
        }

        return flavors;
    }

    function getBilling(selectVersion: string, csp: string): Billing {
        let billing: Billing = {
            model: '' as string,
            period: 'daily' as Billing.period,
            currency: 'euro' as Billing.currency,
        };
        versionMapper.current.forEach((v, k) => {
            if (selectVersion === k) {
                v.forEach((registeredServiceVo) => {
                    if (csp === registeredServiceVo.csp.valueOf()) {
                        billing = registeredServiceVo.billing;
                    }
                });
            }
        });
        return billing;
    }

    const onChangeVersion = (currentVersion: string) => {
        const currentCspList = getCspList(currentVersion);
        const currentAreaList = getAreaList(currentVersion, currentCspList[0]);
        const currentRegionList = getRegionList(currentVersion, currentCspList[0], currentAreaList[0]?.key ?? '');
        const currentFlavorList = getFlavorList(currentVersion, currentCspList[0]);
        const billing: Billing = getBilling(currentVersion, currentCspList[0]);
        setSelectVersion(currentVersion);
        setCspList(currentCspList);
        setSelectCsp(currentCspList[0]);
        setAreaList(currentAreaList);
        setSelectArea(currentAreaList[0]?.key ?? '');
        setRegionList(currentRegionList);
        setSelectRegion(currentRegionList[0]?.value ?? '');
        setFlavorList(currentFlavorList);
        setSelectFlavor(currentFlavorList[0]?.value ?? '');
        setPriceValue(currentFlavorList[0].price);
        setCurrency(currencyMapper[billing.currency]);
    };

    const onChangeCloudProvider = (selectVersion: string, csp: CloudServiceProvider.name) => {
        const currentAreaList = getAreaList(selectVersion, csp);
        const currentRegionList = getRegionList(selectVersion, csp, currentAreaList[0]?.key ?? '');
        const currentFlavorList = getFlavorList(selectVersion, csp);
        const billing: Billing = getBilling(selectVersion, csp);
        setSelectCsp(csp);
        setAreaList(currentAreaList);
        setSelectArea(currentAreaList[0]?.key ?? '');
        setRegionList(currentRegionList);
        setSelectRegion(currentRegionList[0]?.value ?? '');
        setFlavorList(currentFlavorList);
        setSelectFlavor(currentFlavorList[0]?.value ?? '');
        setPriceValue(currentFlavorList[0].price);
        setCurrency(currencyMapper[billing.currency]);
    };

    const onChangeAreaValue = (selectVersion: string, csp: CloudServiceProvider.name, key: string) => {
        const currentRegionList = getRegionList(selectVersion, csp, key);
        setSelectArea(key);
        setRegionList(currentRegionList);
        setSelectRegion(currentRegionList[0]?.value ?? '');
    };

    const onChangeRegion = (value: string) => {
        setSelectRegion(value);
    };

    const onChangeFlavor = (value: string, selectVersion: string, csp: CloudServiceProvider.name) => {
        setSelectFlavor(value);
        const currentFlavorList = getFlavorList(selectVersion, csp);
        const billing: Billing = getBilling(selectVersion, csp);
        currentFlavorList.forEach((flavor) => {
            if (value === flavor.value) {
                setPriceValue(flavor.price);
            }
        });
        setCurrency(currencyMapper[billing.currency]);
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
                <div>
                    <NavigateOrderSubmission text={'<< Back'} to={servicePageUrl as To} props={undefined} />
                    <div className={'Line'} />
                </div>
                <div className={'services-content'}>
                    <div className={'content-title'}>
                        Service: {serviceName}&nbsp;&nbsp;&nbsp;&nbsp; Version:&nbsp;
                        <Select
                            value={selectVersion}
                            className={'version-drop-down'}
                            onChange={onChangeVersion}
                            options={versionList}
                        />
                    </div>
                    <br />
                    <CspSelect
                        selectCsp={selectCsp}
                        cspList={cspList}
                        onChangeHandler={(csp) => {
                            onChangeCloudProvider(selectVersion, csp as CloudServiceProvider.name);
                        }}
                    />
                    <div className={'cloud-provider-tab-class content-title'}>
                        <Tabs
                            type='card'
                            size='middle'
                            activeKey={selectArea}
                            tabPosition={'top'}
                            items={areaList}
                            onChange={(area) => {
                                onChangeAreaValue(selectVersion, selectCsp, area);
                            }}
                        />
                    </div>
                    <div className={'cloud-provider-tab-class region-flavor-content'}>Region:</div>
                    <div className={'cloud-provider-tab-class region-flavor-content'}>
                        <Space wrap>
                            <Select
                                className={'select-box-class'}
                                defaultValue={selectRegion}
                                value={selectRegion}
                                style={{ width: 450 }}
                                onChange={onChangeRegion}
                                options={regionList}
                            />
                        </Space>
                    </div>
                    <div className={'cloud-provider-tab-class region-flavor-content'}>Flavor:</div>
                    <div className={'cloud-provider-tab-class region-flavor-content'}>
                        <Space wrap>
                            <Select
                                className={'select-box-class'}
                                value={selectFlavor}
                                style={{ width: 450 }}
                                onChange={(value) => {
                                    onChangeFlavor(value, selectVersion, selectCsp);
                                }}
                                options={flavorList}
                            />
                        </Space>
                    </div>
                    <div className={'cloud-provider-tab-class region-flavor-content'}>
                        Price:&nbsp;
                        <span className={'services-content-price-class'}>
                            {priceValue}&nbsp;{currency}
                        </span>
                    </div>
                </div>
                <div>
                    <div className={'Line'} />
                    <GoToSubmit
                        categoryName={categoryName}
                        serviceName={serviceName}
                        selectVersion={selectVersion}
                        selectCsp={selectCsp}
                        selectRegion={selectRegion}
                        selectArea={selectArea}
                        selectFlavor={selectFlavor}
                        versionMapper={versionMapper.current}
                    />
                </div>
            </>
        );
    }

    return <></>;
}

export default CreateService;
