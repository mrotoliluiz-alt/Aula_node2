
const db = require('../database/connection');

module.exports = {

    // LISTAR MENSAGENS
    async listarChat(request, response) {
        try {

            const [resultados] = await db.query(
                'SELECT * FROM CHAT_USUARIO'
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de mensagens.',
                itens: resultados.length,
                dados: resultados
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },


    // CADASTRAR MENSAGEM
    async cadastrarChat(request, response) {
        try {

            const {
                chat_remetente,
                chat_destinatario,
                chat_data_hora,
                chat_mensagem,
                chat_status
            } = request.body;

            if (
                !chat_remetente ||
                !chat_destinatario ||
                !chat_mensagem
            ) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe o remetente, o destinatário e o conteúdo da mensagem.',
                    dados: null
                });
            }

            const [resultados] = await db.query(
                `INSERT INTO CHAT_USUARIO
                (
                    chat_remetente,
                    chat_destinatario,
                    chat_data_hora,
                    chat_mensagem,
                    chat_status
                )
                VALUES (?, ?, ?, ?, ?)`,
                [
                    chat_remetente,
                    chat_destinatario,
                    chat_data_hora ?? null,
                    chat_mensagem,
                    chat_status ?? null
                ]
            );

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Mensagem cadastrada com sucesso.',
                dados: {
                    Chat_ID: resultados.insertId,
                    chat_remetente,
                    chat_destinatario,
                    chat_data_hora,
                    chat_mensagem,
                    chat_status
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


    // EDITAR MENSAGEM
    async editarChat(request, response) {
        try {

            const { Chat_ID } = request.params;

            const {
                chat_remetente,
                chat_destinatario,
                chat_data_hora,
                chat_mensagem,
                chat_status
            } = request.body;

            if (
                chat_remetente === undefined &&
                chat_destinatario === undefined &&
                chat_data_hora === undefined &&
                chat_mensagem === undefined &&
                chat_status === undefined
            ) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe pelo menos um campo para edição.',
                    dados: null
                });
            }

            const campos = [];
            const values = [];

            if (chat_remetente !== undefined) {
                campos.push('chat_remetente = ?');
                values.push(chat_remetente);
            }

            if (chat_destinatario !== undefined) {
                campos.push('chat_destinatario = ?');
                values.push(chat_destinatario);
            }

            if (chat_data_hora !== undefined) {
                campos.push('chat_data_hora = ?');
                values.push(chat_data_hora);
            }

            if (chat_mensagem !== undefined) {
                campos.push('chat_mensagem = ?');
                values.push(chat_mensagem);
            }

            if (chat_status !== undefined) {
                campos.push('chat_status = ?');
                values.push(chat_status);
            }

            const sql = `
                UPDATE CHAT_USUARIO
                SET ${campos.join(', ')}
                WHERE Chat_ID = ?
            `;

            values.push(Chat_ID);

            const [resultados] = await db.query(sql, values);

            if (resultados.affectedRows === 0) {

                const [rows] = await db.query(
                    'SELECT Chat_ID FROM CHAT_USUARIO WHERE Chat_ID = ?',
                    [Chat_ID]
                );

                if (rows.length === 0) {
                    return response.status(404).json({
                        sucesso: false,
                        mensagem: `Mensagem ${Chat_ID} não encontrada.`,
                        dados: null
                    });
                }

            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Mensagem editada com sucesso.',
                dados: {
                    Chat_ID: Number(Chat_ID),
                    chat_remetente,
                    chat_destinatario,
                    chat_data_hora,
                    chat_mensagem,
                    chat_status
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


    // APAGAR MENSAGEM
    async apagarChat(request, response) {
        try {

            const { Chat_ID } = request.params;

            const [resultados] = await db.query(
                `DELETE FROM CHAT_USUARIO
                WHERE Chat_ID = ?`,
                [Chat_ID]
            );

            if (resultados.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Mensagem ${Chat_ID} não encontrada.`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Mensagem apagada com sucesso.',
                dados: resultados
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },


    // LISTAR MENSAGENS COM NOME DOS USUÁRIOS
    async listarChatUsuarios(request, response) {
        try {

            const sql = `
                SELECT
                    C.*,
                    R.US_nome AS Remetente,
                    D.US_nome AS Destinatario
                FROM CHAT_USUARIO C
                INNER JOIN USUARIO R
                    ON C.chat_remetente = R.Us_ID
                INNER JOIN USUARIO D
                    ON C.chat_destinatario = D.Us_ID
                ORDER BY C.chat_data_hora;
            `;

            const [resultados] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de mensagens com usuários.',
                itens: resultados.length,
                dados: resultados
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },


    // CONSULTA 2 — LISTAR MENSAGENS DE UMA CONVERSA
    async listarConversa(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                SELECT
                    *
                FROM CHAT_USUARIO
                WHERE
                    chat_remetente = ?
                    OR chat_destinatario = ?
                ORDER BY chat_data_hora;
            `;

            const values = [id, id];

            const [resultados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de mensagens da conversa.',
                itens: resultados.length,
                dados: resultados
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },


    // CONSULTA 3 — MENSAGENS ENVIADAS POR UM USUÁRIO
    async listarMensagensEnviadas(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                SELECT
                    *
                FROM CHAT_USUARIO
                WHERE chat_remetente = ?
                ORDER BY chat_data_hora;
            `;

            const values = [id];

            const [resultados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de mensagens enviadas.',
                itens: resultados.length,
                dados: resultados
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },


    // CONSULTA 4 — MENSAGENS RECEBIDAS POR UM USUÁRIO
    async listarMensagensRecebidas(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                SELECT
                    *
                FROM CHAT_USUARIO
                WHERE chat_destinatario = ?
                ORDER BY chat_data_hora;
            `;

            const values = [id];

            const [resultados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de mensagens recebidas.',
                itens: resultados.length,
                dados: resultados
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
