/**
 * Partial implementation of a class exposing GBFS feeds as async functions and generators
 */

import * as utils from './utils'

const clientId = 'andersrye-bysykkeltest'

export default class {

    #discoveryUrl
    #autoRefresh
    #discoveryDocumentPromise

    constructor(discoveryUrl, { autoRefresh = false } = {}) {
        this.#discoveryUrl = discoveryUrl
        this.#autoRefresh = autoRefresh
    }

    async getDiscoveryDocument() {
        if(!this.#discoveryDocumentPromise) {
            this.#discoveryDocumentPromise = fetch(this.#discoveryUrl, {
                headers: {'client-identifier': clientId}
            }).then(res => res.json())
        }
        return this.#discoveryDocumentPromise
    }

    async getFeedUrl(name, language) {
        const discoveryDocument = await this.getDiscoveryDocument()
        const lang = language ?? Object.keys(discoveryDocument.data)[0] //if language not specified, use first available
        return discoveryDocument?.data?.[lang]?.feeds?.find(f => f.name === name)?.url?.replace(/^.*:\/\//, '//') //the discovery document contains http URLs even when fetched using https, so strip the scheme here to avoid mixed content errors
    }

    async getFeed(name, language) {
        const feedUrl = await this.getFeedUrl(name, language)
        return fetch(feedUrl, {
            headers: {'client-identifier': clientId}
        }).then(res => res.json())
    }

    async *streamFeed(name, language) {
        while(true) {
            const res = await this.getFeed(name, language)
            yield res
            await utils.delaySeconds(res.ttl ?? 10) //todo: wait until ttl seconds after last_updated instead?
        }
    }

    getSystemInfo(language) {
        return this.getFeed("system_information", language)
    }

    getStationInfo(language) {
        return this.getFeed("station_information", language)
    }

    streamStationStatus(language) {
        return this.streamFeed('station_status', language)
    }
}