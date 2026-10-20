const db = require('../database/connection');

module.exports = {
  async listarCapitulos(request, response) {
    try {

      const sql = `SELECT 
            Cap_ID, Ob_ID, Cap_ordem, Cap_titulo, Cap_conteudo
            FROM CAPITULO`;

      const [rows] = await db.query(sql);


      return response.status(200).json({
        sucesso: true,
        mensagem: 'Lista de capítulos.',
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

  async cadastrarCapitulos(request, response) {
    try {

      const {
        Ob_ID,
        Cap_ordem,
        Cap_titulo,
        Cap_conteudo
      } = request.body;

      const sql = `INSERT INTO CAPITULO (
      Ob_ID, Cap_ordem, Cap_titulo, Cap_conteudo)
      VALUES (?, ?, ?, ?)`;

      const values = [
        Ob_ID,
        Cap_ordem,
        Cap_titulo,
        Cap_conteudo
      ];

      const [result] = await db.query(sql,values);

      const dados = {
        id: result.insertId,
        Cap_ordem,
        Cap_titulo,
        Cap_conteudo
      }



      return response.status(200).json({
        sucesso: true,
        mensagem: 'Cadastro de capítulos.',
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


  async editarCapitulos(request, response) {
    try {

      const {
        Ob_ID,
        Cap_ordem,
        Cap_titulo,
        Cap_conteudo
      } = request.body;

      const {id} = request.params;

      const sql = `UPDATE CAPITULO
      SET
          Ob_ID = ?,
          Cap_ordem = ?,
          Cap_titulo = ?,
          Cap_conteudo = ?
        WHERE Cap_ID = ?`;

      const values = [
        Ob_ID,
        Cap_ordem,
        Cap_titulo,
        Cap_conteudo,
        id
      ]

      const [result] = await db.query(sql, values);

      if (result.affectedRows === 0) {
            return response.status(404).json({
                sucesso: false,
                mensagem: `Capitulo ${id} não encontrado!`,
                dados: null
            });
        }

      return response.status(200).json({
        sucesso: true,
        mensagem: 'Editar capítulos.',
        dados: {
          id,
          Cap_ordem,
          Cap_titulo,
          Cap_conteudo
        }
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

      const {id} = request.params;

      const sql = `DELETE FROM CAPITULO WHERE Cap_ID = ?`;

      const values = [id];


      const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Capitulo ${id} não encontrado!`,
                    dados: null
                });
            }

      return response.status(200).json({
        sucesso: true,
        mensagem: `Capitulo ${id} apagado com sucesso`,
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
