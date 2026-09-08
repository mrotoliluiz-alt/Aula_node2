const db = require('../database/connection');

module.exports = {

    // Listar mensagens
    async listarChat(request, response) {
        try {

            const [resultados] = await db.query(
                'SELECT * FROM CHAT_USUARIO'
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de mensagens.',
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

    // Cadastrar mensagem
    async cadastrarChat(request, response) {
        try {

            const {
                chat_remetente,
                chat_destinatario,
                chat_data_hora,
                chat_mensagem,
                chat_status
            } = request.body;

            const [resultados] = await db.query(
                `INSERT INTO CHAT_USUARIO
                (chat_remetente, chat_destinatario, chat_data_hora, chat_mensagem, chat_status)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    chat_remetente,
                    chat_destinatario,
                    chat_data_hora,
                    chat_mensagem,
                    chat_status
                ]
            );

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Mensagem cadastrada com sucesso.',
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

    // Editar mensagem
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

            const [resultados] = await db.query(
                `UPDATE CHAT_USUARIO
                SET chat_remetente = ?,
                    chat_destinatario = ?,
                    chat_data_hora = ?,
                    chat_mensagem = ?,
                    chat_status = ?
                WHERE Chat_ID = ?`,
                [
                    chat_remetente,
                    chat_destinatario,
                    chat_data_hora,
                    chat_mensagem,
                    chat_status,
                    Chat_ID
                ]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Mensagem editada com sucesso.',
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

    // Apagar mensagem
    async apagarChat(request, response) {
        try {

            const { Chat_ID } = request.params;

            const [resultados] = await db.query(
                `DELETE FROM CHAT_USUARIO
                WHERE Chat_ID = ?`,
                [Chat_ID]
            );

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
    }

};
