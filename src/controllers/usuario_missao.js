
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

            if (!Us_ID || !Ms_ID || !Um_Status) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'ID do usuário, ID da missão e status são obrigatórios.',
                    dados: null
                });
            }

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
                Um_Dtconclusao ?? null
            ];

            const [result] = await db.query(sql, values);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Cadastro de usuário na missão realizado.',
                dados: {
                    Us_ID,
                    Ms_ID,
                    Um_Status,
                    Um_Dtconclusao: Um_Dtconclusao ?? null
                }
            });

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: 'Este usuário já está vinculado a esta missão.',
                    dados: null
                });
            }

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
                Um_Status,
                Um_Dtconclusao
            } = request.body;

            const { idUsuario, idMissao } = request.params;

            const campos = {
                Um_Status,
                Um_Dtconclusao
            };

            const camposAtualizar = [];
            const values = [];

            for (const campo in campos) {
                if (campos[campo] !== undefined) {
                    camposAtualizar.push(`${campo} = ?`);
                    values.push(campos[campo]);
                }
            }

            if (camposAtualizar.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Nenhum campo foi informado para atualização.',
                    dados: null
                });
            }

            const sql = `
                UPDATE USUARIO_MISSAO
                SET ${camposAtualizar.join(', ')}
                WHERE Us_ID = ?
                AND Ms_ID = ?
            `;

            values.push(idUsuario, idMissao);

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                const sqlVerificar = `
                    SELECT Us_ID
                    FROM USUARIO_MISSAO
                    WHERE Us_ID = ?
                    AND Ms_ID = ?
                `;

                const [rows] = await db.query(sqlVerificar, [
                    idUsuario,
                    idMissao
                ]);

                if (rows.length === 0) {
                    return response.status(404).json({
                        sucesso: false,
                        mensagem: 'Vínculo entre usuário e missão não encontrado.',
                        dados: null
                    });
                }
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Missão ${idMissao} do usuário ${idUsuario} editada com sucesso!`,
                dados: {
                    Us_ID: idUsuario,
                    Ms_ID: idMissao,
                    Um_Status: Um_Status,
                    Um_Dtconclusao: Um_Dtconclusao
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
            const { idUsuario, idMissao } = request.params;

            const sql = `
                DELETE FROM USUARIO_MISSAO
                WHERE Us_ID = ?
                AND Ms_ID = ?
            `;

            const values = [idUsuario, idMissao];

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
                mensagem: 'Vínculo entre usuário e missão removido com sucesso.',
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
