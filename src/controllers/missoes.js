
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

            if (!Ms_titulo || !Ms_tipo || Ms_recompensaXP === undefined) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe o título, a recompensa XP e o tipo da missão.',
                    dados: null
                });
            }

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
                Ms_descricao ?? null,
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

            if (
                Ms_titulo === undefined &&
                Ms_descricao === undefined &&
                Ms_recompensaXP === undefined &&
                Ms_tipo === undefined
            ) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe pelo menos um campo para edição.',
                    dados: null
                });
            }

            const campos = [];
            const values = [];

            if (Ms_titulo !== undefined) {
                campos.push('Ms_titulo = ?');
                values.push(Ms_titulo);
            }

            if (Ms_descricao !== undefined) {
                campos.push('Ms_descricao = ?');
                values.push(Ms_descricao);
            }

            if (Ms_recompensaXP !== undefined) {
                campos.push('Ms_recompensaXP = ?');
                values.push(Ms_recompensaXP);
            }

            if (Ms_tipo !== undefined) {
                campos.push('Ms_tipo = ?');
                values.push(Ms_tipo);
            }

            const sql = `
                UPDATE MISSOES
                SET ${campos.join(', ')}
                WHERE Ms_ID = ?
            `;

            values.push(id);

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {

                const [rows] = await db.query(
                    'SELECT Ms_ID FROM MISSOES WHERE Ms_ID = ?',
                    [id]
                );

                if (rows.length === 0) {
                    return response.status(404).json({

                        sucesso: false,
                        mensagem: `Missão ${id} não encontrada.`,
                        dados: null

                    });
                }

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

    },


    async listarMissoesRecompensa(request, response) {

        try {

            const sql = `
                SELECT
                    Ms_ID,
                    Ms_titulo,
                    Ms_descricao,
                    Ms_recompensaXP,
                    Ms_tipo
                FROM MISSOES
                ORDER BY Ms_recompensaXP DESC;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Lista de missões ordenadas por recompensa.',
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


    // CONSULTA 2 — PESQUISAR MISSÕES PELO TÍTULO
    async pesquisarMissoes(request, response) {

        try {

            const { titulo } = request.query;

            const sql = `
                SELECT
                    Ms_ID,
                    Ms_titulo,
                    Ms_descricao,
                    Ms_recompensaXP,
                    Ms_tipo
                FROM MISSOES
                WHERE Ms_titulo LIKE ?;
            `;

            const values = [`%${titulo ?? ''}%`];

            const [rows] = await db.query(sql, values);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Pesquisa de missões.',
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


    // CONSULTA 3 — LISTAR MISSÕES POR TIPO
    async listarMissoesTipo(request, response) {

        try {

            const { tipo } = request.params;

            const sql = `
                SELECT
                    Ms_ID,
                    Ms_titulo,
                    Ms_descricao,
                    Ms_recompensaXP,
                    Ms_tipo
                FROM MISSOES
                WHERE Ms_tipo = ?;
            `;

            const values = [tipo];

            const [rows] = await db.query(sql, values);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Lista de missões por tipo.',
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


    // CONSULTA 4 — MISSÕES DOS USUÁRIOS COM STATUS E DATA DE CONCLUSÃO
    async listarMissoesUsuarios(request, response) {

        try {

            const sql = `
                SELECT
                    U.US_nome AS Usuario,
                    M.Ms_titulo AS Missao,
                    M.Ms_tipo AS Tipo,
                    M.Ms_recompensaXP AS Recompensa_XP,
                    UM.Um_Status AS Status,
                    UM.Um_Dtconclusao AS Data_Conclusao
                FROM USUARIO_MISSAO UM
                INNER JOIN USUARIO U
                    ON UM.Us_ID = U.Us_ID
                INNER JOIN MISSOES M
                    ON UM.Ms_ID = M.Ms_ID;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Lista de missões dos usuários.',
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

    }

};
