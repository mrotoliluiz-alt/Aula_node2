const db = require('../database/connection');

module.exports = {
  async listarCapitulos(request, response) {
    try {
      return response.status(200).json({
        sucesso: true,
        mensagem: 'Lista de capítulos.',
        dados: null
      });
    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: 'Erro na requisição.',
        dados: error.message
      });
    }
  },

  async cadastrarCapitulos(request, response) {
    try {
      return response.status(200).json({
        sucesso: true,
        mensagem: 'Cadastro de capítulos.',
        dados: null
      });
    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: 'Erro na requisição.',
        dados: error.message
      });
    }
  },

  async editarCapitulos(request, response) {
    try {
      return response.status(200).json({
        sucesso: true,
        mensagem: 'Editar capítulos.',
        dados: null
      });
    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: 'Erro na requisição.',
        dados: error.message
      });
    }
  },

  async apagarCapitulos(request, response) {
    try {
      return response.status(200).json({
        sucesso: true,
        mensagem: 'Apagar capítulos.',
        dados: null
      });
    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: 'Erro na requisição.',
        dados: error.message
      });
    }
  }
};
