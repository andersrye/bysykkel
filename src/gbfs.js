const clientId = 'andersrye-bysykkeltest'

export async function getDiscoveryDocument(url) {
    return fetch(url, {
        headers: {'client-identifier': clientId}
    }).then(res => res.json())
}

export function getFeedUrl(discoveryDocument, name, language = Object.keys(discoveryDocument.data)[0]) {
    return discoveryDocument?.data?.[language]?.feeds?.find(f => f.name === name)?.url
}

export async function getFeed(discoveryDocument, name, language) {
    const feedUrl = getFeedUrl(discoveryDocument, name, language)
    return fetch(feedUrl, {
        headers: {'client-identifier': clientId}
    }).then(res => res.json())
}
