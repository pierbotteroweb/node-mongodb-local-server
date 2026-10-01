const { WebSocketServer } = require('ws')
const { MongoClient } = require('mongodb')

function watchChanges(MONGO_URL, MONGO_DB_NAME, watchers, server) {
    const wss = new WebSocketServer({ server })

    wss.on('connection', async (ws) => {
        console.log('WebSocket connection established')

        const streams = []

        for (const watcher of watchers) {
            const client = new MongoClient(MONGO_URL)
            let changeStream

            try {
                console.log(`Watching for changes in ${watcher.collectionName}...`)
                await client.connect()

                const db = client.db(MONGO_DB_NAME)
                const collection = db.collection(watcher.collectionName)
                const pipeline = [{ $match: watcher.matchObject }]

                changeStream = collection.watch(pipeline)
                streams.push({ client, changeStream })

                changeStream.on('change', (change) => {
                    if (ws.readyState === ws.OPEN) {
                        ws.send(JSON.stringify({
                            collection: watcher.collectionName,
                            change
                        }))
                    }
                })
            } catch (error) {
                console.error(`Error watching ${watcher.collectionName}:`, error)
                await client.close()
            }
        }

        ws.on('close', async () => {
            console.log('WebSocket connection closed')

            for (const stream of streams) {
                await stream.changeStream.close()
                await stream.client.close()
            }
        })
    })

    return wss
}

module.exports = watchChanges