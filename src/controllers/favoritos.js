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
            Ob_ID,
            Fav_status,
            Ob_PagAtual
        } = request.body;

        const sql = `
            INSERT INTO FAVORITOS_SALVOS (
                Us_ID,
                Ob_ID,
                Fav_status,
                Ob_PagAtual
            )
            VALUES (?, ?, ?, ?)
        `;

        const values = [
            Us_ID,
            Ob_ID,
            Fav_status,
            Ob_PagAtual
        ];

        const [result] = await db.query(sql, values);

        const dados = {
            id: result.insertId,
            Us_ID,
            Ob_ID,
            Fav_status,
            Ob_PagAtual
        };

        return response.status(201).json({
            sucesso: true,
            mensagem: 'Favorito salvo com sucesso.',
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
        const {
            Us_ID,
            Fav_status,
            Ob_PagAtual
        } = request.body;

        const { id } = request.params;

        const sql = `
            UPDATE FAVORITOS_SALVOS
            SET
                Fav_status = ?,
                Ob_PagAtual = ?
            WHERE Ob_ID = ? AND Us_ID = ?
        `;

        const values = [
            Fav_status,
            Ob_PagAtual,
            id,
            Us_ID
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return response.status(404).json({
                sucesso: false,
                mensagem: `Favorito da obra ${id} não encontrado para este usuário!`,
                dados: null
            });
        }

        return response.status(200).json({
            sucesso: true,
            mensagem: `Favorito da obra ${id} editado com sucesso.`,
            dados: {
                id,
                Us_ID,
                Fav_status,
                Ob_PagAtual
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


  async apagarFavoritosSalvos(request, response) {
    try {

      const {id} = request.params;

            const sql = `DELETE FROM FAVORITOS_SALVOS WHERE Us_ID = ? and Ob_ID`;

            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: ` Obra Favorita ${id} não encontrada!`,
                    dados: null
                });
            }

      return response.status(200).json({
        sucesso: true,
        mensagem: `Obra Favorita ${id} apagada com sucesso.`,
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
