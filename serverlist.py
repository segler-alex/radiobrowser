#!/bin/env python
import socket
import random

def get_radiobrowser_base_urls():
    """
    Get all base urls of all currently available radiobrowser servers

    Returns: 
    list: a list of strings

    """
    hosts = []
    # get all hosts from DNS
    ips = socket.getaddrinfo('all.api.radio-browser.info',
                             80, 0, 0, socket.IPPROTO_TCP)
    for ip_tupple in ips:
        ip = ip_tupple[4][0]

        # do a reverse lookup on every one of the ips to have a nice name for it
        host_addr = socket.gethostbyaddr(ip)
        # add the name to a list if not already in there
        if host_addr[0] not in hosts:
            hosts.append(host_addr[0])

    # sort list of names
    hosts.sort()
    # add "https://" in front to make it an url
    return list(map(lambda x: "https://" + x, hosts))

def get_radiobrowser_base_url_random():
	"""
    Get a random available base url

    Returns: 
    str: a random available base url

    """
	hosts = get_radiobrowser_base_urls()
	return random.choice(hosts)

# print list of names
print("All available urls")
print("------------------")
for host in get_radiobrowser_base_urls():
    print(host)
print("")

# print random
print("Random url")
print("------------------")
print(get_radiobrowser_base_url_random())