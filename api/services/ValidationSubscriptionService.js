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

export async function subscribeToRippleds(rippleds) {

  // Subscribe to validation websocket subscriptions from rippleds
  for (let rippled of rippleds) {
    if (!rippled.ipp) continue;

    const ip = 'ws://'+rippled.ipp.replace(PEER_PORT_REGEX, WS_PORT)

    // Skip addresses that are already connected
    if (connections[ip]) continue;

    let ws = new WebSocket(ip);

    connections[ip] = {
      public_key: rippled.public_key,
      ws: ws
    }

    ws.on('error', function(error){
      console.log(this.url, error)
      if (this.url && connections[this.url]) {
        if (connections[this.url].ws) {
          connections[this.url].ws.close()
        }
        delete connections[this.url]
        console.log(`${_.size(connections)} connections`)
      }
    })

    ws.on('open', function () {
      if (this.url && connections[this.url] && connections[this.url].ws) {
        connections[this.url].ws.send(JSON.stringify({
          "id": 1,
          "command": "subscribe",
          "streams": [
            "validations"
          ]
        }))
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
      } else if (data.error==='unknownStream') {
        delete connections[this.url]
        console.log(data.error)
        console.log(`${_.size(connections)} connections`)
      }
    })
  }

  return connections
}

export async function start() {

  try {
    if (!process.env.PEERS_API_URL) {
      throw new Error('PEERS_API_URL required')
    }

    const peers_api_url = process.env.PEERS_API_URL

    // Subscribe to rippleds
    const rippleds = await getRippleds(peers_api_url)
    await subscribeToRippleds(rippleds)
    console.log('Subscribed to rippled validation streams')

    // Subscribe to new rippled connections hourly
    const job = new CronJob('0 0 * * * *', async function() {
      try {
        const rippleds = await getRippleds(peers_api_url)
        await subscribeToRippleds(rippleds)
        console.log('Subscribed to rippled validation streams')
      } catch (error) {
        console.error('Error with validation subscription task', error)
      }
    }, null, true)
    console.log('Started validation subscription service')
  } catch (error) {
    console.error('Error starting validation subscription service:', error)
  }
}

export async function stop() {
  try {
    // Delete all websocket connections
    _.forEachRight(this.connections, (connection) => {
      connection.ws.close()
    })
    this.connections={}
  } catch (error) {
    console.error('Error stopping validation subscription service:', error)
  }
}
