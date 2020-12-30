const moment = require('moment')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
  adiciona (atendimento, res) {
    const sql = 'INSERT INTO atendimentos SET ?'
    const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
    const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
    const atendimentoDatado = { ...atendimento, dataCriacao, data }
    const dataFormatoValido = data !== 'Invalid date'
    const dataValida = moment(data).isSameOrAfter(dataCriacao, 'day')
    const clienteValido = atendimento.cliente.length >= 5

    console.log('dataValida', dataValida, data, '>=', dataCriacao)
    const validacoes = [
      {
        nome: 'dataFormatoInvalido',
        valido: dataFormatoValido,
        mensage: 'Data inválida. Use o formato DD/MM/AAAA.'
      },
      {
        nome: 'data',
        valido: dataValida,
        mensagem: 'Data dever ser maior ou igual a data atual'
      },
      {
        nome: 'cliente',
        valido: clienteValido,
        mensagem: 'Cliente deve ter pelo menos cinco caracterers'
      }
    ]

    const erros = validacoes.filter(campo => !campo.valido)
    const existemErros = erros.length

    if (existemErros) {
      res.status(400).json(erros)
    } else {
      conexao.query(sql, atendimentoDatado, (erro, resultados) => {
        if (erro) {
          res.status(400).json(erro)
        } else {
          res.status(201).json(resultados)
        }
      })
    }
  }

  lista (res) {
    const sql = 'SELECT * FROM atendimentos'

    conexao.query(sql, (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro)
      } else {
        res.status(200).json(resultados)
      }
    })
  }

  buscaPorId (id, res) {
    const sql = `SELECT * FROM atendimentos WHERE id=${id}`

    conexao.query(sql, (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro)
      } else {
        const resultado = resultados[0] || null
        if (resultado) {
          res.status(200).json(resultado)
        } else {
          res.status(500).json({ message: 'Erro ao acessar o banco' })
        }
      }
    })
  }

  altera (id, valores, res) {
    const sql = 'UPDATE atendimentos SET ? WHERE id=?'
    if (valores.data) {
      valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
    }

    conexao.query(sql, [valores, id], (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro)
      } else {
        res.status(200).json(resultados)
      }
    })
  }
}

module.exports = new Atendimento()
