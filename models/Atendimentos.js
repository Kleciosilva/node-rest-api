const moment = require('moment')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
  adiciona (atendimento, res) {
    const sql = 'INSERT INTO atendimentos SET ?'
    const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
    const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
    const atendimentoDatado = { ...atendimento, dataCriacao, data }
    const dataFormatoValido = data !== 'Invalid date'
    const dataValida = moment(data).isSameOrAfter(moment(dataCriacao).format('YYYY-MM-DD'))
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
          res.status(201).json({
            id: resultados.insertId,
            ...atendimentoDatado
          })
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
          res.status(404).json({ message: 'Registro não encontrado' })
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
        res.status(200).json({ ...valores, id })
      }
    })
  }

  deleta (id, res) {
    const sql = `DELETE FROM atendimentos WHERE id=${id}`

    conexao.query(sql, (erro, resultado) => {
      if (erro) {
        res.status(400).json(erro)
      } else if (!resultado.affectedRows) {
        res.status(204).send()
      } else {
        res.status(200).json(resultado)
      }
    })
  }
}

module.exports = new Atendimento()
