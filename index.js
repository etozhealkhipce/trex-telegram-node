const http = require('http')
const TeleBot = require('telebot')

const host = 'localhost'
const port = 3000
const token = ''

const trex = {
  host: 'http://127.0.1.1',
  port: '12000',
  url: 'summary'
}

http
  .createServer(function (request, response) {
    response.end()
  })
  .listen(port, host, () => {
    const bot = new TeleBot({
      token
    })

    bot.on('/stats', (msg) => {
      http
        .get(`${trex.host}:${trex.port}/${trex.url}`, (resp) => {
          let response = null

          resp.on('data', (res) => {
            const decode = JSON.parse(res.toString())
            response = `Решения: ${decode.accepted_count}/${decode.rejected_count}\n
                        Пул: ${decode.active_pool.url}\n
                        Пинг: ${decode.active_pool.ping}\n
                        Алгоритм: ${decode.algorithm}\n
                        Версия драйвера: ${decode.driver}\n
                        Всего карт: ${decode.gpu_total}\n
                        Хэшрейт: ${decode.hashrate}\n
                        Система: ${decode.os}\n
                        Время работы: ${decode.uptime}`
          })

          resp.on('end', () => {
            bot.sendMessage(msg.from.id, response)
          })
        })
        .on('error', (err) => {
          bot.sendMessage(msg.from.id, err.message)
        })
    })

    bot.start()
  })
