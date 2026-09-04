const db = require('../database/connection');

module.exports = {
  async listarFavoritosSalvos(request, response) {
    try {
      return response.status(200).json({
        sucesso: true,
        mensagem: 'Lista de favoritos salvos.',
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

  async cadastrarFavoritosSalvos(request, response) {
    try {
      return response.status(200).json({
        sucesso: true,
        mensagem: 'Cadastro de favoritos salvos.',
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

  async editarFavoritosSalvos(request, response) {
    try {
      return response.status(200).json({
        sucesso: true,
        mensagem: 'Editar favoritos salvos.',
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

  async apagarFavoritosSalvos(request, response) {
    try {
      return response.status(200).json({
        sucesso: true,
        mensagem: 'Apagar favoritos salvos.',
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
