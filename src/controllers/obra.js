const db = require('../database/connection');

module.exports = {

    // LISTAR OBRAS
    async listarObras(request, response) {
        try {

            const [resultado] = await db.query(
                'SELECT * FROM OBRA'
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de obras.',
                dados: resultado
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },


    // CADASTRAR OBRA
    async cadastrarObra(request, response) {
        try {

            const {
                Us_ID,
                Ob_titulo,
                Ob_sinopse,
                Ob_genero,
                Ob_status,
                Ob_imagem
            } = request.body;

            const [resultado] = await db.query(
                `INSERT INTO OBRA
                (Us_ID, Ob_titulo, Ob_sinopse, Ob_genero, Ob_status, Ob_imagem)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    Us_ID,
                    Ob_titulo,
                    Ob_sinopse,
                    Ob_genero,
                    Ob_status,
                    Ob_imagem
                ]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Obra cadastrada com sucesso.',
                dados: resultado
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },


    // EDITAR OBRA
    async editarObra(request, response) {
        try {

            const { id } = request.params;

            const {
                Us_ID,
                Ob_titulo,
                Ob_sinopse,
                Ob_genero,
                Ob_status,
                Ob_imagem
            } = request.body;

            const [resultado] = await db.query(
                `UPDATE OBRA
                SET
                    Us_ID = ?,
                    Ob_titulo = ?,
                    Ob_sinopse = ?,
                    Ob_genero = ?,
                    Ob_status = ?,
                    Ob_imagem = ?
                WHERE Ob_ID = ?`,
                [
                    Us_ID,
                    Ob_titulo,
                    Ob_sinopse,
                    Ob_genero,
                    Ob_status,
                    Ob_imagem,
                    id
                ]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Obra editada com sucesso.',
                dados: resultado
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },


    // APAGAR OBRA
    async apagarObra(request, response) {
        try {

            const { id } = request.params;

            const [resultado] = await db.query(
                'DELETE FROM OBRA WHERE Ob_ID = ?',
                [id]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Obra apagada com sucesso.',
                dados: resultado
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },

    async listarGeneros(request, response) {
        try {
            const {genero} = request.query;

            const Ob_genero = genero ? `%${genero}%` : `%`;
            const sql = `
            SELECT
                Ob_ID, Ob_titulo, Ob_sinopse, Ob_status,
                Ob_imagem
            FROM
                obra
            WHERE
                Ob_genero like ?;
            `;

            const values = [Ob_genero];

            const [rows] = await db.query(sql, values);
            const nItens = rows.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: `Livros por genero`,
                nItens,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            })

        }
    },

    async buscaTitulo(request, response) {
        try {
            const {titulo} = request.query;

            const Ob_titulo = titulo ? `%${titulo}%` : `%`;
            const sql = `
            SELECT
                Ob_ID, Ob_titulo, Ob_sinopse, Ob_status,
                Ob_imagem
            FROM
                obra
            WHERE
                Ob_titulo like ?;
            `;

            const values = [Ob_titulo];

            const [rows] = await db.query(sql, values);
            const nItens = rows.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: `Livros por genero`,
                nItens,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            })

        }
    }

};
