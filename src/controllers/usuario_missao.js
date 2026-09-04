const db = require('../database/connection');

module.exports = {

    async listarUsuarioMissoes(request, response) {

        try {

            const [usuarioMissoes] = await db.query(`
                SELECT
                    Us_ID,
                    Ms_ID,
                    Um_Status,
                    Um_Dtconclusao
                FROM USUARIO_MISSAO
            `);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Lista de usuários e missões.',
                dados: usuarioMissoes

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

            await db.query(`
                INSERT INTO USUARIO_MISSAO
                (
                    Us_ID,
                    Ms_ID,
                    Um_Status,
                    Um_Dtconclusao
                )
                VALUES (?, ?, ?, ?)
            `, [
                Us_ID,
                Ms_ID,
                Um_Status,
                Um_Dtconclusao
            ]);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Cadastro de usuário na missão realizado.',
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


    async editarUsuarioMissao(request, response) {

        try {

            const {
                Us_ID,
                Ms_ID,
                Um_Status,
                Um_Dtconclusao
            } = request.body;

            await db.query(`
                UPDATE USUARIO_MISSAO
                SET
                    Um_Status = ?,
                    Um_Dtconclusao = ?
                WHERE Us_ID = ?
                AND Ms_ID = ?
            `, [
                Um_Status,
                Um_Dtconclusao,
                Us_ID,
                Ms_ID
            ]);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Edição de usuário na missão realizada.',
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


    async apagarUsuarioMissao(request, response) {

        try {

            const {
                Us_ID,
                Ms_ID
            } = request.body;

            await db.query(`
                DELETE FROM USUARIO_MISSAO
                WHERE Us_ID = ?
                AND Ms_ID = ?
            `, [
                Us_ID,
                Ms_ID
            ]);

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

}