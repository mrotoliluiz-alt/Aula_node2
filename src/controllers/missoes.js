
const db = require('../database/connection');

module.exports = {

    async listarMissoes(request, response) {

        try {

            const sql = `
                SELECT
                    Ms_ID,
                    Ms_titulo,
                    Ms_descricao,
                    Ms_recompensaXP,
                    Ms_tipo
                FROM MISSOES
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Lista de missões.',
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


    async cadastrarMissao(request, response) {

        try {

            const {
                Ms_titulo,
                Ms_descricao,
                Ms_recompensaXP,
                Ms_tipo
            } = request.body;

            const sql = `
                INSERT INTO MISSOES (
                    Ms_titulo,
                    Ms_descricao,
                    Ms_recompensaXP,
                    Ms_tipo
                )
                VALUES (?, ?, ?, ?)
            `;

            const values = [
                Ms_titulo,
                Ms_descricao,
                Ms_recompensaXP,
                Ms_tipo
            ];

            const [result] = await db.query(sql, values);

            const dados = {
                Ms_ID: result.insertId,
                Ms_titulo,
                Ms_descricao,
                Ms_recompensaXP,
                Ms_tipo
            };

            return response.status(201).json({

                sucesso: true,
                mensagem: 'Missão cadastrada com sucesso.',
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


    async editarMissao(request, response) {

        try {

            const {
                Ms_titulo,
                Ms_descricao,
                Ms_recompensaXP,
                Ms_tipo
            } = request.body;

            const { id } = request.params;

            const sql = `
                UPDATE MISSOES
                SET
                    Ms_titulo = ?,
                    Ms_descricao = ?,
                    Ms_recompensaXP = ?,
                    Ms_tipo = ?
                WHERE Ms_ID = ?
            `;

            const values = [
                Ms_titulo,
                Ms_descricao,
                Ms_recompensaXP,
                Ms_tipo,
                id
            ];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {

                return response.status(404).json({

                    sucesso: false,
                    mensagem: `Missão ${id} não encontrada ou nenhum dado foi alterado.`,
                    dados: null

                });

            }

            return response.status(200).json({

                sucesso: true,
                mensagem: `Missão ${id} editada com sucesso!`,
                dados: {
                    Ms_ID: Number(id),
                    Ms_titulo,
                    Ms_descricao,
                    Ms_recompensaXP,
                    Ms_tipo
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


    async apagarMissao(request, response) {

        try {

            const { id } = request.params;

            const sql = `
                DELETE FROM MISSOES
                WHERE Ms_ID = ?
            `;

            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {

                return response.status(404).json({

                    sucesso: false,
                    mensagem: `Missão ${id} não encontrada.`,
                    dados: null

                });

            }

            return response.status(200).json({

                sucesso: true,
                mensagem: `Missão ${id} apagada com sucesso.`,
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
