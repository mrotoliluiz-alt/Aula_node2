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
                    com_obr_Dtenvio,
                    com_obr_texto,
                    com_obr_moderacao
                ]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Comentário cadastrado com sucesso.',
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

            const [resultado] = await db.query(
                `UPDATE COMENTARIO_OBRA
                SET
                    Us_ID = ?,
                    Ob_ID = ?,
                    com_obr_Dtenvio = ?,
                    com_obr_texto = ?,
                    com_obr_moderacao = ?
                WHERE id_interacao = ?`,
                [
                    Us_ID,
                    Ob_ID,
                    com_obr_Dtenvio,
                    com_obr_texto,
                    com_obr_moderacao,
                    id
                ]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Comentário editado com sucesso.',
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


    // APAGAR COMENTÁRIO
    async apagarComentario(request, response) {
        try {

            const { id } = request.params;

            const [resultado] = await db.query(
                'DELETE FROM COMENTARIO_OBRA WHERE id_interacao = ?',
                [id]
            );

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
    }

};
