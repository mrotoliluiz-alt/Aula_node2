const db = require('../database/connection');

module.exports = {

    // Listar seguidores/seguidos
    async listarSeguindo(request, response) {
        try {

            const [resultados] = await db.query(
                'SELECT * FROM SEGUINDO'
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de usuários seguidos.',
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

    // Cadastrar seguindo
    async cadastrarSeguindo(request, response) {
        try {

            const {
                Us_ID,
                Seguindo
            } = request.body;

            const [resultados] = await db.query(
                `INSERT INTO SEGUINDO
                (Us_ID, Seguindo)
                VALUES (?, ?)`,
                [
                    Us_ID,
                    Seguindo
                ]
            );

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Usuário seguido com sucesso.',
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

    // Editar seguindo
    async editarSeguindo(request, response) {
        try {

            const { Us_ID } = request.params;

            const {
                Seguindo
            } = request.body;

            const [resultados] = await db.query(
                `UPDATE SEGUINDO
                SET Seguindo = ?
                WHERE Us_ID = ?`,
                [
                    Seguindo,
                    Us_ID
                ]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Seguindo editado com sucesso.',
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

    // Apagar seguindo
    async apagarSeguindo(request, response) {
        try {

            const { Us_ID } = request.params;

            const [resultados] = await db.query(
                `DELETE FROM SEGUINDO
                WHERE Us_ID = ?`,
                [Us_ID]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Seguindo apagado com sucesso.',
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
