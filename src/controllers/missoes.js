
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

    }, 

    // 1. Lista os vínculos com os dados do usuário e da missão
    async listarUsuarioMissoesDetalhado(request, response) {
        try {
            const sql = `
                SELECT
                    UM.Us_ID,
                    U.US_nome AS Usuario,
                    UM.Ms_ID,
                    M.Ms_titulo AS Missao,
                    M.Ms_descricao AS Descricao,
                    M.Ms_recompensaXP AS Recompensa_XP,
                    UM.Um_Status,
                    UM.Um_Dtconclusao
                FROM USUARIO_MISSAO UM
                INNER JOIN USUARIO U
                    ON UM.Us_ID = U.Us_ID
                INNER JOIN MISSOES M
                    ON UM.Ms_ID = M.Ms_ID
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista detalhada de usuários e missões consultada com sucesso.',
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

    // 2. Lista todas as missões de um usuário específico
    async listarMissoesUsuario(request, response) {
        try {
            const { id } = request.params;

            const sql = `
                SELECT
                    UM.Us_ID,
                    UM.Ms_ID,
                    M.Ms_titulo,
                    M.Ms_descricao,
                    M.Ms_recompensaXP,
                    M.Ms_tipo,
                    UM.Um_Status,
                    UM.Um_Dtconclusao
                FROM USUARIO_MISSAO UM
                INNER JOIN MISSOES M
                    ON UM.Ms_ID = M.Ms_ID
                WHERE UM.Us_ID = ?
            `;

            const [rows] = await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: rows.length > 0
                    ? 'Missões do usuário encontradas com sucesso.'
                    : 'Nenhuma missão encontrada para este usuário.',
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

    // 3. Lista os usuários vinculados a uma missão específica
    async listarUsuariosMissao(request, response) {
        try {
            const { id } = request.params;

            const sql = `
                SELECT
                    UM.Ms_ID,
                    M.Ms_titulo,
                    UM.Us_ID,
                    U.US_nome AS Usuario,
                    UM.Um_Status,
                    UM.Um_Dtconclusao
                FROM USUARIO_MISSAO UM
                INNER JOIN USUARIO U
                    ON UM.Us_ID = U.Us_ID
                INNER JOIN MISSOES M
                    ON UM.Ms_ID = M.Ms_ID
                WHERE UM.Ms_ID = ?
            `;

            const [rows] = await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: rows.length > 0
                    ? 'Usuários vinculados à missão encontrados com sucesso.'
                    : 'Nenhum usuário encontrado nesta missão.',
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

    // 4. Conta quantas missões cada usuário possui
    async listarQuantidadeMissoesUsuario(request, response) {
        try {
            const sql = `
                SELECT
                    U.Us_ID,
                    U.US_nome,
                    COUNT(UM.Ms_ID) AS QuantidadeMissoes
                FROM USUARIO U
                LEFT JOIN USUARIO_MISSAO UM
                    ON U.Us_ID = UM.Us_ID
                GROUP BY U.Us_ID, U.US_nome
                ORDER BY QuantidadeMissoes DESC
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Quantidade de missões por usuário consultada com sucesso.',
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
