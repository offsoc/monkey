import Grid from '@mui/material/Grid';
import React, { useEffect, useMemo, useState } from 'react';
import SearchFilter from '@/app/(protected)/plugins/_lib/filters/SearchFilter';
import TypeFilter from '@/app/(protected)/plugins/_lib/filters/TypeFilter';
import {
    generatePluginsTableRows,
    PluginRow
} from '@/app/(protected)/plugins/_lib/PluginTable';
import _ from 'lodash';
import useInstallablePlugins from '@/app/(protected)/plugins/_lib/useInstallablePlugins';

type AvailablePluginFiltersProps = {
    setDisplayedRowsCallback: (rows: PluginRow[]) => void;
    setIsFilteringCallback: (isFiltering: boolean) => void;
};

type PluginFilterFunc = (row: PluginRow) => boolean;

export type FilterProps = {
    setFilterCallback: (
        filterName: string,
        filterFunc: PluginFilterFunc
    ) => void;
};

export const defaultSearchableColumns = [
    'name',
    'pluginType',
    'version',
    'author'
];

const AvailablePluginFilters = (props: AvailablePluginFiltersProps) => {
    const { setDisplayedRowsCallback, setIsFilteringCallback } = props;

    const installablePlugins = useInstallablePlugins();
    const [filters, setFilters] = useState({});

    const setFilterCallback = (
        filterName: string,
        filterFunc: PluginFilterFunc
    ) => {
        setFilters((prevState) => {
            return { ...prevState, [filterName]: filterFunc };
        });
    };

    const filterRows = (rows: PluginRow[]): PluginRow[] => {
        setIsFilteringCallback(true);
        let filteredRows = _.cloneDeep(rows);
        for (const filter of Object.values(filters)) {
            // @ts-ignore
            filteredRows = filteredRows.filter(filter);
        }
        setIsFilteringCallback(false);
        return filteredRows;
    };

    const allPluginRows: PluginRow[] = useMemo(() => {
        if (installablePlugins === undefined) return [];
        return generatePluginsTableRows(installablePlugins);
    }, [installablePlugins]);

    useEffect(() => {
        if (allPluginRows) {
            const filteredRows = filterRows(allPluginRows);
            setDisplayedRowsCallback(filteredRows);
        }
    }, [allPluginRows, filters]);

    if (installablePlugins !== undefined) {
        return (
            <Grid container spacing={2} sx={{ margin: 0 }}>
                <Grid
                    xs={7}
                    item
                    sx={{ alignItems: 'flex-end', display: 'flex' }}>
                    <SearchFilter
                        setFilterCallback={setFilterCallback}
                        searchableColumns={defaultSearchableColumns}
                    />
                </Grid>
                <Grid
                    xs={5}
                    item
                    sx={{ alignItems: 'flex-end', display: 'flex' }}>
                    <TypeFilter
                        setFilterCallback={setFilterCallback}
                        allRows={allPluginRows}
                    />
                </Grid>
            </Grid>
        );
    }
    return null;
};

export default AvailablePluginFilters;
