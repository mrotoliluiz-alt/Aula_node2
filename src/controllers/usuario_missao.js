
const db = require('../database/connection');

module.exports = {

    async listarUsuarioMissoes(request, response) {

        try {

            const sql = `
                SELECT
                    Us_ID,
                    Ms_ID,
                    Um_Status,
                    Um_Dtconclusao
                FROM USUARIO_MISSAO
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Lista de usuários e missões.',
                itens: rows.length,
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


    async cadastrarUsuarioMissao(request, response) {

        try {

            const {
                Us_ID,
                Ms_ID,
                Um_Status,
                Um_Dtconclusao
            } = request.body;

            const sql = `
                INSERT INTO USUARIO_MISSAO (
                    Us_ID,
                    Ms_ID,
                    Um_Status,
                    Um_Dtconclusao
                )
                VALUES (?, ?, ?, ?)
            `;

            const values = [
                Us_ID,
                Ms_ID,
                Um_Status,
                Um_Dtconclusao
            ];

            const [result] = await db.query(sql, values);

            const dados = {
                Us_ID,
                Ms_ID,
                Um_Status,
                Um_Dtconclusao
            };

            return response.status(201).json({

                sucesso: true,
                mensagem: 'Cadastro de usuário na missão realizado.',
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


   
async editarUsuarioMissao(request, response) {
    try {
        const {
            Us_ID,
            Um_Status,
            Um_Dtconclusao
        } = request.body;

        const { id } = request.params;

        const sql = `
            UPDATE USUARIO_MISSAO
            SET
                Um_Status = ?,
                Um_Dtconclusao = ?
            WHERE Us_ID = ?
            AND Ms_ID = ?
        `;

        const values = [
            Um_Status,
            Um_Dtconclusao,
            Us_ID,
            id
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return response.status(404).json({
                sucesso: false,
                mensagem: 'Vínculo entre usuário e missão não encontrado.',
                dados: null
            });
        }

        return response.status(200).json({
            sucesso: true,
            mensagem: `Missão ${id} editada com sucesso!`,
            dados: {
                Us_ID,
                Ms_ID: id,
                Um_Status,
                Um_Dtconclusao
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



    async apagarUsuarioMissao(request, response) {

        try {

            const {
                Us_ID,
                Ms_ID
            } = request.body;

            const sql = `
                DELETE FROM USUARIO_MISSAO
                WHERE Us_ID = ?
                AND Ms_ID = ?
            `;

            const values = [
                Us_ID,
                Ms_ID
            ];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {

                return response.status(404).json({

                    sucesso: false,
                    mensagem: 'Vínculo entre usuário e missão não encontrado.',
                    dados: null

                });

            }

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Usuário removido da missão.',
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
