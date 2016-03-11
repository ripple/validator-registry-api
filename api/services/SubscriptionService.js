import {CronJob} from 'cron'
import request from 'superagent'
import WebSocket from 'ws'

const PEER_PORT_REGEX = /51235/g
const WS_PORT = '51233'

let connections = {}

export async function getRippleds(api_url) {
  const response = await request.get(`${api_url}/rippleds`)
  return response.body
}

function requestSubscribe(ws) {

  // Subscribe to validations and manifests separately because 
  // older rippleds will treat manifests as malformedStream
  ws.send(JSON.stringify({
    "id": 1,
    "command": "subscribe",
    "streams": [
      "validations"
    ]
  }))

  ws.send(JSON.stringify({
    "id": 2,
    "command": "subscribe",
    "streams": [
      "manifests"
    ]
  }))
}

export function subscribe(ip) {

  // Resubscribe to are already connected addresses
  if (connections[ip]) {
    requestSubscribe(connections[ip])
  }

  let ws = new WebSocket(ip);

  connections[ip] = ws

  ws.on('error', function(error){
    console.log(error)
    if (this.url && connections[this.url]) {
      if (connections[this.url]) {
        connections[this.url].close()
      }
      delete connections[this.url]
      console.log(`${_.size(connections)} connections`)
    }
  })

  ws.on('open', function () {
    if (this.url && connections[this.url]) {
      requestSubscribe(connections[this.url])
    }
  })

  ws.on('message', function(dataString, flags) {
    const data = JSON.parse(dataString)
    if (data.type==='validationReceived') {
      database.Validations.create({
        validation_public_key: data.validation_public_key,
        ledger_hash: data.ledger_hash,
        signature: data.signature
      }).catch(error => {
        if (error.name!=='SequelizeUniqueConstraintError') {
          console.log(error)
        }
      })
    } else if (data.type==='manifestReceived') {
      console.log(data)
      database.Manifests.create({
        ephemeral_public_key: data.signing_key,
        master_public_key: data.master_key,
        sequence: data.seq,
        signature: data.signature
      }).catch(error => {
        if (error.name!=='SequelizeUniqueConstraintError') {
          console.log(error)
        }
      })
    } else if (data.error && data.error!=='unknownStream' &&
               data.error!=='malformedStream') {
      delete connections[this.url]
      console.log(data.error)
      console.log(`${_.size(connections)} connections`)
    }
  })
}

export async function subscribeToRippleds(rippleds) {

  // Subscribe to validation and manifest websocket subscriptions from rippleds
  for (let rippled of rippleds) {
    if (!rippled.ipp) continue;

    const ip = 'ws://'+rippled.ipp.replace(PEER_PORT_REGEX, WS_PORT)
    subscribe(ip)
  }

  subscribe('wss://s.altnet.rippletest.net:51233')

  return connections
}

export async function start() {

  try {
    if (!process.env.PEERS_API_URL) {
      throw new Error('PEERS_API_URL required')
    }

    // Load manifests into cache
    await database.Manifests.loadCache()

    const peers_api_url = process.env.PEERS_API_URL

    // Subscribe to rippleds
    const rippleds = await getRippleds(peers_api_url)
    await subscribeToRippleds(rippleds)
    console.log('Subscribed to rippled validation and manifest streams')

    // Subscribe to new rippled connections every five minutes
    const job = new CronJob('0 */5 * * * *', async function() {
      try {
        const rippleds = await getRippleds(peers_api_url)
        await subscribeToRippleds(rippleds)
        console.log('Subscribed to rippled validation and manifest streams')
      } catch (error) {
        console.error('Error with subscription task', error)
      }
    }, null, true)
    console.log('Started subscription service')
  } catch (error) {
    console.error('Error starting subscription service:', error)
  }
}

export async function stop() {
  try {
    // Delete all websocket connections
    _.forEachRight(this.connections, (connection) => {
      connection.close()
    })
    this.connections={}
  } catch (error) {
    console.error('Error stopping subscription service:', error)
  }
}
