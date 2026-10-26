const db = require('../database/connection');

module.exports = {

    // LISTAR OBRAS
    async listarObras(request, response) {
        try {
            const { titulo, page = 1, limit = 5} = request.query;
            const offset = (parseInt(page) - 1) * parseInt(limit); 

            const countQuery = `
            SELECT COUNT(*) AS total FROM obra 
                WHERE Ob_titulo LIKE ?`;
            
            const countValues = [`%${titulo ?? ''}%`];
            const [[{ total }]] = await db.query(countQuery, countValues);




            const listQuery = `
            SELECT
                OBRA.Ob_ID,
                OBRA.Ob_titulo AS Obra,
                USUARIO.Us_nome AS Autor,
                OBRA.Ob_genero AS Genero,
                COUNT(CAPITULO.Cap_ID) AS Quantidade_Capitulos
            FROM OBRA
            INNER JOIN USUARIO
                ON OBRA.Us_ID = USUARIO.Us_ID
            LEFT JOIN CAPITULO
                ON OBRA.Ob_ID = CAPITULO.Ob_ID
            WHERE
                OBRA.Ob_titulo like ?
            GROUP BY
                OBRA.Ob_ID,
                OBRA.Ob_titulo,
                USUARIO.Us_nome,
                OBRA.Ob_genero
            ORDER BY OBRA.Ob_ID
            LIMIT ?, ?
            `;

            const listValues =
                [`%${titulo ?? ''}%`, offset, parseInt(limit)];
               

            const [obras] = await db.query( listQuery, listValues);

            const dados = obras.map(obras => ({
                id: obras.Ob_ID,
                titulo: obras.Ob_titulo,
                sinopse: obras.Ob_sinopse,
                status: obras.Ob_status,
                imagem: obras.Ob_imagem               
            }))

            response.setHeader('X-Total-Count', total);
            return response.status(200).json({
                sucesso: true,
                mensagem: `lista de livros`,
                nItens: dados.length,
                dados
            });

        } catch (error) {
            console.error('Erro ao listar obras:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar obras.',
                dados: error.message
            })

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

};
