export function stationAsFeature(station) {
    return {
        type: 'Feature',
        properties: {
            name: station.name,
            address: station.address,
            capacity: station.capacity,
            num_bikes_available: station.num_bikes_available,
            num_docks_available: station.num_docks_available
        },
        geometry: {
            type: 'Point',
            coordinates: [station.lon, station.lat]
        }
    }
}

export function stationsAsFeatureCollection(stations) {
    return {
        type: 'FeatureCollection',
        features: stations?.map(station => stationAsFeature(station)) ?? []
    }
}
