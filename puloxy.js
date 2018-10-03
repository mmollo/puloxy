const net = require('net')
const util = require('util')
const events = require('events')

class Proxy
{
    constructor(name, srcHost, srcPort, dstHost, dstPort)
    {
        events.call(this)
        this.name = name;
        let server = net.createServer(local => {
            
            let remote = net.connect(dstPort, dstHost, _ => {
                console.log(this.name, 'Remote connected to ' + dstHost + ':' + dstPort)
                local.on('disconnect', _ => {remote.destroy()})
                remote.on('disconnect', _ => {local.destroy()})
            })

            remote.on('data', data => {
                local.write(data)
            })
            
            local.on('data', data => {
                remote.write(data)
            })
            
            local.on('error', err => {
                console.error(this.name, err)
            })

            remote.on('error', err => {
                console.error(this.name, err)
            })
            
            this.emit('client', {remote:remote, local:local});
        })
        
        server.listen(srcPort, srcHost)
        console.log(this.name, 'Listening on ' + srcHost + ':' + srcPort)
    }
}

util.inherits(Proxy, events)

module.exports = Proxy
