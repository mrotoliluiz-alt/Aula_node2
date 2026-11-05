
const db = require('../database/connection');

module.exports = {

    // LISTAR COMENTÁRIOS
    async listarComentarios(request, response) {
        try {

            const [resultado] = await db.query(
                'SELECT * FROM COMENTARIO_OBRA'
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de comentários.',
                itens: resultado.length,
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


    // CADASTRAR COMENTÁRIO
    async cadastrarComentario(request, response) {
        try {

            const {
                Us_ID,
                Ob_ID,
                com_obr_Dtenvio,
                com_obr_texto,
                com_obr_moderacao
            } = request.body;

            if (!Us_ID || !Ob_ID || !com_obr_texto) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe o usuário, a obra e o texto do comentário.',
                    dados: null
                });
            }

            const [resultado] = await db.query(
                `INSERT INTO COMENTARIO_OBRA
                (
                    Us_ID,
                    Ob_ID,
                    com_obr_Dtenvio,
                    com_obr_texto,
                    com_obr_moderacao
                )
                VALUES (?, ?, ?, ?, ?)`,
                [
                    Us_ID,
                    Ob_ID,
                    com_obr_Dtenvio ?? null,
                    com_obr_texto,
                    com_obr_moderacao ?? null
                ]
            );

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Comentário cadastrado com sucesso.',
                dados: {
                    Com_ID: resultado.insertId,
                    Us_ID,
                    Ob_ID,
                    com_obr_Dtenvio,
                    com_obr_texto,
                    com_obr_moderacao
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


    // EDITAR COMENTÁRIO
    async editarComentario(request, response) {
        try {

            const { id } = request.params;

            const {
                Us_ID,
                Ob_ID,
                com_obr_Dtenvio,
                com_obr_texto,
                com_obr_moderacao
            } = request.body;

            if (
                Us_ID === undefined &&
                Ob_ID === undefined &&
                com_obr_Dtenvio === undefined &&
                com_obr_texto === undefined &&
                com_obr_moderacao === undefined
            ) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe pelo menos um campo para edição.',
                    dados: null
                });
            }

            const campos = [];
            const values = [];

            if (Us_ID !== undefined) {
                campos.push('Us_ID = ?');
                values.push(Us_ID);
            }

            if (Ob_ID !== undefined) {
                campos.push('Ob_ID = ?');
                values.push(Ob_ID);
            }

            if (com_obr_Dtenvio !== undefined) {
                campos.push('com_obr_Dtenvio = ?');
                values.push(com_obr_Dtenvio);
            }

            if (com_obr_texto !== undefined) {
                campos.push('com_obr_texto = ?');
                values.push(com_obr_texto);
            }

            if (com_obr_moderacao !== undefined) {
                campos.push('com_obr_moderacao = ?');
                values.push(com_obr_moderacao);
            }

            const sql = `
                UPDATE COMENTARIO_OBRA
                SET ${campos.join(', ')}
                WHERE Com_ID = ?
            `;

            values.push(id);

            const [resultado] = await db.query(sql, values);

            if (resultado.affectedRows === 0) {

                const [rows] = await db.query(
                    'SELECT Com_ID FROM COMENTARIO_OBRA WHERE Com_ID = ?',
                    [id]
                );

                if (rows.length === 0) {
                    return response.status(404).json({
                        sucesso: false,
                        mensagem: `Comentário ${id} não encontrado.`,
                        dados: null
                    });
                }

            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Comentário editado com sucesso.',
                dados: {
                    Com_ID: Number(id),
                    Us_ID,
                    Ob_ID,
                    com_obr_Dtenvio,
                    com_obr_texto,
                    com_obr_moderacao
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


    // APAGAR COMENTÁRIO
    async apagarComentario(request, response) {
        try {

            const { id } = request.params;

            const [resultado] = await db.query(
                'DELETE FROM COMENTARIO_OBRA WHERE Com_ID = ?',
                [id]
            );

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Comentário ${id} não encontrado.`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Comentário apagado com sucesso.',
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


    // CONSULTA 1 — COMENTÁRIOS COM NOME DO USUÁRIO E TÍTULO DA OBRA
    async listarComentariosDetalhados(request, response) {
        try {

            const sql = `
                SELECT
                    C.Com_ID,
                    U.US_nome AS Usuario,
                    O.Ob_titulo AS Obra,
                    C.com_obr_texto AS Comentario,
                    C.com_obr_Dtenvio AS Data_Envio,
                    C.com_obr_moderacao AS Moderacao
                FROM COMENTARIO_OBRA C
                INNER JOIN USUARIO U
                    ON C.Us_ID = U.Us_ID
                INNER JOIN OBRA O
                    ON C.Ob_ID = O.Ob_ID
                ORDER BY C.com_obr_Dtenvio DESC;
            `;

            const [resultado] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de comentários detalhados.',
                itens: resultado.length,
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


    // CONSULTA 2 — COMENTÁRIOS DE UMA OBRA
    async listarComentariosObra(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                SELECT
                    Com_ID,
                    Us_ID,
                    Ob_ID,
                    com_obr_texto,
                    com_obr_Dtenvio,
                    com_obr_moderacao
                FROM COMENTARIO_OBRA
                WHERE Ob_ID = ?
                ORDER BY com_obr_Dtenvio DESC;
            `;

            const values = [id];

            const [resultado] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de comentários da obra.',
                itens: resultado.length,
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


    // CONSULTA 3 — COMENTÁRIOS DE UM USUÁRIO
    async listarComentariosUsuario(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                SELECT
                    Com_ID,
                    Us_ID,
                    Ob_ID,
                    com_obr_texto,
                    com_obr_Dtenvio,
                    com_obr_moderacao
                FROM COMENTARIO_OBRA
                WHERE Us_ID = ?
                ORDER BY com_obr_Dtenvio DESC;
            `;

            const values = [id];

            const [resultado] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de comentários do usuário.',
                itens: resultado.length,
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


    // CONSULTA 4 — COMENTÁRIOS POR MODERAÇÃO
    async listarComentariosModeracao(request, response) {
        try {

            const { moderacao } = request.params;

            const sql = `
                SELECT
                    Com_ID,
                    Us_ID,
                    Ob_ID,
                    com_obr_texto,
                    com_obr_Dtenvio,
                    com_obr_moderacao
                FROM COMENTARIO_OBRA
                WHERE com_obr_moderacao = ?
                ORDER BY com_obr_Dtenvio DESC;
            `;

            const values = [moderacao];

            const [resultado] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de comentários por moderação.',
                itens: resultado.length,
                dados: resultado
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
