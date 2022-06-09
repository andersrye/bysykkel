export function stationAsFeature(info, status = {}) {
    const { num_bikes_available: bikesAvailable, num_docks_available: docksAvailable } = status
    const { name, address, capacity, lon, lat } = info
    return {
        type: 'Feature',
        properties: {
            name,
            address,
            capacity,
            bikesAvailable,
            docksAvailable
        },
        geometry: {
            type: 'Point',
            coordinates: [lon, lat]
        }
    }
}

export function stationAsFeatureCollection(stationInfo, stationStatus) {
    const statusById = stationStatus?.data?.stations?.reduce((acc, status) => {
        acc[status.station_id] = status
        return acc
    }, {}) ?? {}
    return {
        type: 'FeatureCollection',
        features: stationInfo?.data?.stations?.map(info => {
            return stationAsFeature(info, statusById[info.station_id])
        }) ?? []
    }
}
