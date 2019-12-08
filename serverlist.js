#!/bin/env node

const dns = require('dns');
const util = require('util');
const resolve4 = util.promisify(dns.resolve4);
const reverse = util.promisify(dns.reverse);

/**
 * Get a list of base urls of all available radio-browser servers
 * Returns: array of strings - base urls of radio-browser servers
 */
function get_radiobrowser_base_urls() {
    return resolve4("all.api.radio-browser.info").then(hosts => {
        let jobs = hosts.map(host => reverse(host));
        return Promise.all(jobs);
    }).then(hosts => {
        hosts.sort();
        return hosts.map(host_arr => "https://" + host_arr[0]);
    });
}

/**
 * Get a random available radio-browser server.
 * Returns: string - base url for radio-browser api
 */
function get_radiobrowser_base_url_random() {
    return get_radiobrowser_base_urls().then(hosts => {
        var item = hosts[Math.floor(Math.random() * hosts.length)];
        return item;
    });
}

get_radiobrowser_base_urls().then(hosts => {
    console.log("All available urls")
    console.log("------------------")
    for (let host of hosts) {
        console.log(host);
    }
    console.log();

    return get_radiobrowser_base_url_random();
}).then(random_host => {
    console.log("Random base url")
    console.log("------------------")
    console.log(random_host);
});