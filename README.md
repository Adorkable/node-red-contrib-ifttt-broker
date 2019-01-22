## Node-RED IFTTT Broker
An IFTTT Broker for Node-RED

![dependencies](https://img.shields.io/david/adorkable/node-red-contrib-ifttt-broker.svg?style=flat-square)
![dev-dependencies](https://img.shields.io/david/dev/adorkable/node-red-contrib-ifttt-broker.svg?style=flat-square)
![optional-dependencies](https://img.shields.io/david/optional/adorkable/node-red-contrib-ifttt-broker.svg?style=flat-square)
![peer-dependencies](https://img.shields.io/david/peer/adorkable/node-red-contrib-ifttt-broker.svg?style=flat-square) 

<img src="images/Works_with_IFTTT_Badge-white_on_black-88x48.svg" alt="Works with IFTTT" width="88"/>

![Examples Image](images/examples.png)

## Why
This library allows you to send and receive **IFTTT** Triggers and Actions. 

**Note**: If you are only looking to initiate a Trigger check out Diego Pamio's [node-red-contrib-ifttt](https://flows.nodered.org/node/node-red-contrib-ifttt), it's much simplier and you'll have it set up and running in two seconds! 🌟

Still with us? 💁‍

So you may be wondering what makes this library different? Well, building on top of Amadeus's excellent [node-ifttt](https://github.com/amadeusmuc/node-ifttt) we are able to provide full support of the IFTTT feature set. Most excellently we can make our own Node-RED flows triggered by IFTTT!

Additionally:

* support for a large volume of IFTTT Triggers
* multiple, custom IFTTT Action and Trigger Fields
* Triggers and Actions within multiple (user or custom) contexts *(not yet implemented)*

### Note: This library is super early in development and node structure and configuration information is subject to change!
We will do our best to change configuration only when necessary and do our best to use Node-RED's mechanisms to draw attention when things have changed.

## Requirements

Using this library requires an IFTTT account with access to the **IFTTT Platform Service**, both of which are free for private usage. To sign up visit here: [https://platform.ifttt.com/platform_sign_up](https://platform.ifttt.com/platform_sign_up).

Using this library also requires that IFTTT has HTTP or HTTPS access to the machine you are running Node-RED on. _**Note: just with any public facing server please take the steps to ensure your server is secure! If you haven't already read through the [Node-RED Security Documentation](https://nodered.org/docs/security) to take the necessary steps.**_ 

## Install

To install the node run the following from your Node-RED user directory (`~/.node-red`):
```bash
npm install node-red-contrib-ifttt-broker
```

Or install the node from the Palette section of your Node-RED editor by searching by name (`node-red-contrib-ifttt-broker`).

## Setup

To set up a Trigger or an Action one creates it in Node-RED and then makes IFTTT Platform aware that it exists. 

_**Watch this space for more elaborate instructions!**_

1. Create and add the appropriate node to a Node-RED flow. 
    
    An IFTTT Action Node can be started by a Trigger in an IFTTT Applet and initiate a flow.
    
    ![Trigger and Action Node](images/setup/triggerAndAction.png)

    An IFTTT Trigger Node can start an Action in an IFTTT Applet and can be initiated by a flow.

1. Choose an endpoint for your node.
1. Add the appropriate fields, ingredients, etc to the node.
1. Don't forget to Deploy!

1. Create a new IFTTT Platform Service if you haven't already or wish to organize this new Trigger or Action separately. 
1. Add the configuration information for your Trigger or for your Action in IFTTT Platform.
1. (optionally) use the Endpoint Tests page to test that your setup matches.
1. Create your IFTTT Applets.
1. 🔥🔥🔥


## Contributions
There are many ways this library will be further built out but if you want a feature sooner feel free to create a pull request! Please first start a discussion in an issue so we can strategize implementation before you dive in, that way it'll be less work for you in the end!

## Thanks
This library stands on the shoulders of [Amadeus'](https://github.com/amadeusmuc) library [node-ifttt](https://github.com/amadeusmuc/node-ifttt), many thanks! 

Additionally the library was inspired by [node-red-contrib-mqtt-broker](https://github.com/zuhito/node-red-contrib-mqtt-broker), which is such a boon for locally routed MQTT communication!
