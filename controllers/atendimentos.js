const Atendimento = require('../models/Atendimentos')

module.exports = app => {
  app.get('/atendimentos', (req, res) => res.send('Você está na rota de atendimentos S2'))

  app.post('/atendimentos', (req, res) => {
    const atendimento = req.body

    Atendimento.adiciona(atendimento, res)
  })
}
