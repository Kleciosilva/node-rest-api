const moment = require('moment')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
  adiciona (atendimento, res) {
    const sql = 'INSERT INTO atendimentos SET ?'
    const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
    console.log('Data----->>>>', data)
    const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
    const atendimentoDatado = { ...atendimento, dataCriacao, data }

    if (data === 'Invalid date') return res.status(400).json({ error: 'Data inválida. Use o formato DD/MM/AAAA.' })

    conexao.query(sql, atendimentoDatado, (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro)
      } else {
        res.status(200).json(resultados)
      }
    })
  }
}

module.exports = new Atendimento()
