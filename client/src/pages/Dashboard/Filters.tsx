import * as React from 'react'
import { Box, FormControl, InputLabel, MenuItem, Rating, Select, Stack, TextField, Typography } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers-pro'
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'

import { DateRange as DateRangeType, Rating as RatingType } from 'shared/types'

import { ExtendedBike, Filters as FiltersType } from './types'

type Props = {
    filters: FiltersType
    setFilters: React.Dispatch<React.SetStateAction<FiltersType>>
    dateRange: DateRangeType
    setDateRange: React.Dispatch<React.SetStateAction<DateRangeType>>
    bikes: ReadonlyArray<ExtendedBike>
}

export const Filters = ({ filters, setFilters, dateRange, setDateRange, bikes }: Props) => {
    const onFilterChange = (type: keyof FiltersType, value: FiltersType[keyof FiltersType]) => {
        setFilters((oldFilter) => ({ ...oldFilter, [type]: value }))
    }

    const models = [...new Set(bikes.map((bike) => bike.model))]
    const colors = [...new Set(bikes.map((bike) => bike.color))]
    const locations = [...new Set(bikes.map((bike) => bike.location))]

    return (
        <Stack direction="row" spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns} localeText={{ start: 'From', end: 'To' }}>
                <DateRangePicker
                    disablePast
                    value={dateRange}
                    onChange={(newValue) => setDateRange(newValue)}
                    renderInput={(startProps, endProps) => (
                        <>
                            <TextField {...startProps} />
                            <Box sx={{ mx: 2 }}> to </Box>
                            <TextField {...endProps} />
                        </>
                    )}
                />
            </LocalizationProvider>
            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Model</InputLabel>
                <Select
                    value={filters.model}
                    label="Model"
                    onChange={(event) => onFilterChange('model', event.target.value)}
                >
                    <MenuItem value="">None</MenuItem>
                    {models.map((model) => (
                        <MenuItem key={model} value={model}>
                            {model}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Color</InputLabel>
                <Select
                    value={filters.color}
                    label="Color"
                    onChange={(event) => onFilterChange('color', event.target.value)}
                >
                    <MenuItem value="">None</MenuItem>
                    {colors.map((color) => (
                        <MenuItem key={color} value={color}>
                            {color}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Location</InputLabel>
                <Select
                    value={filters.location}
                    label="Location"
                    onChange={(event) => onFilterChange('location', event.target.value)}
                >
                    <MenuItem value="">None</MenuItem>
                    {locations.map((location) => (
                        <MenuItem key={location} value={location}>
                            {location}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
                <Typography component="legend">Filter by rating</Typography>
                <Rating
                    value={filters.rating}
                    onChange={(_event, value) => onFilterChange('rating', value as RatingType['value'])}
                />
            </FormControl>
        </Stack>
    )
}
