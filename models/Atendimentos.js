const moment = require('moment')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
  adiciona (atendimento) {
    const sql = 'INSERT INTO atendimentos SET ?'
    const data = moment(atendimento.data, 'DD/MM/YYYY').format('yyyy-MM-DD HH:MM:SS')
    const dataCriacao = moment().format('yyyy-MM-DD HH:MM:SS')
    const atendimentoDatado = { ...atendimento, dataCriacao, data }

    conexao.query(sql, atendimentoDatado, (erro, resultados) => {
      if (erro) {
        console.log(erro)
      } else {
        console.log(resultados)
      }
    })
  }
}

module.exports = new Atendimento()
