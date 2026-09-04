const db = require('../database/connection');

module.exports = {

    async listarMissoes(request, response) {

        try {

            const [missoes] = await db.query(`
                SELECT
                    Ms_ID,
                    Ms_titulo,
                    Ms_descricao,
                    Ms_recompensasXP,
                    Ms_tipo
                FROM MISSOES
            `);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Lista de missões.',
                dados: missoes

            });

        } catch (error) {

            return response.status(500).json({

                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message

            });

        }

    },


    async cadastrarMissao(request, response) {

        try {

            const {
                Ms_titulo,
                Ms_descricao,
                Ms_recompensasXP,
                Ms_tipo
            } = request.body;

            await db.query(`
                INSERT INTO MISSOES
                (
                    Ms_titulo,
                    Ms_descricao,
                    Ms_recompensasXP,
                    Ms_tipo
                )
                VALUES (?, ?, ?, ?)
            `, [
                Ms_titulo,
                Ms_descricao,
                Ms_recompensasXP,
                Ms_tipo
            ]);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Missão cadastrada com sucesso.',
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


    async editarMissao(request, response) {

        try {

            const {
                Ms_ID,
                Ms_titulo,
                Ms_descricao,
                Ms_recompensasXP,
                Ms_tipo
            } = request.body;

            await db.query(`
                UPDATE MISSOES
                SET
                    Ms_titulo = ?,
                    Ms_descricao = ?,
                    Ms_recompensasXP = ?,
                    Ms_tipo = ?
                WHERE Ms_ID = ?
            `, [
                Ms_titulo,
                Ms_descricao,
                Ms_recompensasXP,
                Ms_tipo,
                Ms_ID
            ]);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Missão editada com sucesso.',
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


    async apagarMissao(request, response) {

        try {

            const {
                Ms_ID
            } = request.body;

            await db.query(`
                DELETE FROM MISSOES
                WHERE Ms_ID = ?
            `, [
                Ms_ID
            ]);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Missão apagada com sucesso.',
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