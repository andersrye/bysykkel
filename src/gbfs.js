/**
 * Partial implementation of a simple client for consuming GBFS data and feeds as async functions and generators
 */

function _delaySeconds(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

function _checkOk(res) {
    if (!res.ok) {
        throw new Error(`Request failed: ${res.statusCode}`)
    }
    return res
}

export default class {

    #discoveryUrl
    #discoveryDocumentPromise
    #clientId

    /**
     * @param {string} discoveryUrl - Url pointing to the gbfs.json discovery document
     * @param {object} options -
     * @param {string} options.clientId - identifier to add as 'client-identifier' to all requests
     */
    constructor(discoveryUrl, options = {}) {
        this.#discoveryUrl = discoveryUrl
        this.#clientId = options.clientId
    }

    #getHeaders() {
        const headers = {}
        if(this.#clientId) {
            headers['client-identifier'] = this.#clientId
        }
        return headers
    }

    async #getDiscoveryDocument() {
        if (!this.#discoveryDocumentPromise) {
            this.#discoveryDocumentPromise = fetch(this.#discoveryUrl, {
                headers: this.#getHeaders()
            })
                .then(_checkOk)
                .then(res => res.json())
        }
        return this.#discoveryDocumentPromise
    }

    async #getFeedUrl(name, language) {
        const discoveryDocument = await this.#getDiscoveryDocument()
        const lang = language ?? Object.keys(discoveryDocument.data)[0] //if language is not specified, use first available
        let feedUrl = discoveryDocument?.data?.[lang]?.feeds?.find(f => f.name === name)?.url
        if(!feedUrl) {
            throw Error("Feed not found")
        }
        feedUrl = feedUrl.replace(/^.*:\/\//, '//') //the discovery document contains http URLs even when fetched using https, so strip the scheme here to avoid mixed content errors
        return  feedUrl
    }

    async #getFeed(name, language) {
        const feedUrl = await this.#getFeedUrl(name, language)
        return fetch(feedUrl, {
            headers: this.#getHeaders()
        })
            .then(_checkOk)
            .then(res => res.json())
    }

    async* #streamFeed(name, language) {
        while (true) {
            const res = await this.#getFeed(name, language)
            yield res
            await _delaySeconds(res.ttl ?? 10) //todo: wait until ttl seconds after last_updated instead?
        }
    }

    //todo: method to get available languages
    
    getSystemInfo(language) {
        return this.#getFeed('system_information', language)
    }

    getStationInfo(language) {
        return this.#getFeed('station_information', language)
    }

    streamStationStatus(language) {
        return this.#streamFeed('station_status', language)
    }

    //todo: add remaining feeds
}
