const db = require('../database/connection');

module.exports = {
  async listarFavoritosSalvos(request, response) {
    try {

      const sql = `SELECT 
           Ob_ID, Us_ID, Fav_status, Ob_PagAtual
            FROM FAVORITOS_SALVOS`;

          const [rows] = await db.query(sql);

      return response.status(200).json({
        sucesso: true,
        mensagem: 'Lista de favoritos salvos.',
        itens: rows.lenght,
        dados: rows
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

      const {
            Us_ID,
            Fav_status,
            Ob_PagAtual
        } = request.body;

        const sql = `
        INSERT INTO USUARIO (
            Us_ID,
            Fav_status,
            Ob_PagAtual
        )
        VALUES (?, ?, ?)
    `;

    const values = [
      Us_ID,
      Fav_status,
      Ob_PagAtual
    ];

    const [result] = await db.query(sql, values);

        const dados = {
            id: result.insertId,
           Fav_status,
           Ob_PagAtual
        };




      return response.status(200).json({
        sucesso: true,
        mensagem: 'Cadastro de favoritos salvos.',
        dados: dados
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
