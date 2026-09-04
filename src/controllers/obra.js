const db = require('../database/connection');

module.exports = {

    // LISTAR OBRAS
    async listarObras(request, response) {
        try {

            const [resultado] = await db.query(
                'SELECT * FROM OBRA'
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de obras.',
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


    // CADASTRAR OBRA
    async cadastrarObra(request, response) {
        try {

            const {
                Us_ID,
                Ob_titulo,
                Ob_sinopse,
                Ob_genero,
                Ob_status,
                Ob_imagem
            } = request.body;

            const [resultado] = await db.query(
                `INSERT INTO OBRA
                (Us_ID, Ob_titulo, Ob_sinopse, Ob_genero, Ob_status, Ob_imagem)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    Us_ID,
                    Ob_titulo,
                    Ob_sinopse,
                    Ob_genero,
                    Ob_status,
                    Ob_imagem
                ]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Obra cadastrada com sucesso.',
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


    // EDITAR OBRA
    async editarObra(request, response) {
        try {

            const { id } = request.params;

            const {
                Us_ID,
                Ob_titulo,
                Ob_sinopse,
                Ob_genero,
                Ob_status,
                Ob_imagem
            } = request.body;

            const [resultado] = await db.query(
                `UPDATE OBRA
                SET
                    Us_ID = ?,
                    Ob_titulo = ?,
                    Ob_sinopse = ?,
                    Ob_genero = ?,
                    Ob_status = ?,
                    Ob_imagem = ?
                WHERE Ob_ID = ?`,
                [
                    Us_ID,
                    Ob_titulo,
                    Ob_sinopse,
                    Ob_genero,
                    Ob_status,
                    Ob_imagem,
                    id
                ]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Obra editada com sucesso.',
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


    // APAGAR OBRA
    async apagarObra(request, response) {
        try {

            const { id } = request.params;

            const [resultado] = await db.query(
                'DELETE FROM OBRA WHERE Ob_ID = ?',
                [id]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Obra apagada com sucesso.',
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
