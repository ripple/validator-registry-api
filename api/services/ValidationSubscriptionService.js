import {CronJob} from 'cron'
import request from 'superagent'
import WebSocket from 'ws'

const PEER_PORT_REGEX = /51235/g
const WS_PORT = '51233'

let connections = {}

export async function getRippleds(api_url) {
  const response = await request.get(api_url)
  return response.body
}

export async function subscribeToRippleds(rippleds) {

  // Subscribe to validation websocket subscriptions from rippleds
  for (let rippled of rippleds) {
    if (!rippled.ipp) continue;

    const ip = 'ws://'+rippled.ipp.replace(PEER_PORT_REGEX, WS_PORT)

    // Skip addresses that are already connected
    if (connections.ip) continue;

    let ws = new WebSocket(ip);

    connections[ip] = {
      public_key: rippled.public_key,
      ws: ws
    }

    ws.on('error', function(error){
      console.error(this.url, error)
      connections[this.url].ws.close()
      delete connections[this.url]
    })

    ws.on('open', function () {
      connections[this.url].ws.send(JSON.stringify({
        "id": 1,
        "command": "subscribe",
        "streams": [
          "validations"
        ]
      }))
    })

    ws.on('message', function(dataString, flags) {
      const data = JSON.parse(dataString)
      if (data.type==='validationReceived') {
        database.Validations.create({
          validation_public_key: data.validation_public_key,
          ledger_hash: data.ledger_hash,
          reporter_public_key: connections[this.url].public_key
        })
      }
    })
  }

  return connections
}

export async function stop() {
  try {
    // Delete all websocket connections
    _.forEachRight(connections, (connection) => {
      connection.ws.close()
    })
    connections={}
  } catch (error) {
    console.error('Error stopping validation subscription service:', error)
  }
}

export async function start() {
  try {

    if (!process.env.RIPPLED_CRAWLER_API_URL) {
      throw new Error('RIPPLED_CRAWLER_API_URL required')
    }

    const rippled_api_url = process.env.RIPPLED_CRAWLER_API_URL

    // Subscribe to rippleds
    const rippleds = getRippleds(rippled_api_url)
    await subscribeToRippleds(rippleds)
    console.log('Subscribed to rippled validation streams')

    // Subscribe to new rippled connections hourly
    const job = new CronJob('0 0 * * * *', async function() {
      try {
        const rippleds = getRippleds(rippled_api_url)
        subscribeToRippleds()
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
