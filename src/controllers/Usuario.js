const db = require('../database/connection');

module.exports = {

    async listarUsuarios(request, response) {

        try {

            const [usuarios] = await db.query(`
                SELECT
                    Us_ID,
                    Us_nome,
                    Us_email,
                    Us_biografia,
                    Us_selo_verificacao,
                    Us_nivel,
                    Us_xp_total,
                    Us_dt_ultimo_acesso,
                    Us_adm,
                    Us_Imagem
                FROM USUARIO
            `);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Lista de usuários.',
                dados: usuarios

            });

        } catch (error) {

            return response.status(500).json({

                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message

            });

        }

    },


    async cadastrarUsuario(request, response) {

        try {

            const {
                Us_nome,
                Us_email,
                Us_senha,
                Us_biografia,
                Us_selo_verificacao,
                Us_nivel,
                Us_xp_total,
                Us_dt_ultimo_acesso,
                Us_adm,
                Us_Imagem
            } = request.body;

            await db.query(`
                INSERT INTO USUARIO
                (
                    Us_nome,
                    Us_email,
                    Us_senha,
                    Us_biografia,
                    Us_selo_verificacao,
                    Us_nivel,
                    Us_xp_total,
                    Us_dt_ultimo_acesso,
                    Us_adm,
                    Us_Imagem
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                Us_nome,
                Us_email,
                Us_senha,
                Us_biografia,
                Us_selo_verificacao,
                Us_nivel,
                Us_xp_total,
                Us_dt_ultimo_acesso,
                Us_adm,
                Us_Imagem
            ]);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Usuário cadastrado com sucesso.',
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


    async editarUsuario(request, response) {

        try {

            const {
                Us_ID,
                Us_nome,
                Us_email,
                Us_senha,
                Us_biografia,
                Us_selo_verificacao,
                Us_nivel,
                Us_xp_total,
                Us_dt_ultimo_acesso,
                Us_adm,
                Us_Imagem
            } = request.body;

            await db.query(`
                UPDATE USUARIO
                SET
                    Us_nome = ?,
                    Us_email = ?,
                    Us_senha = ?,
                    Us_biografia = ?,
                    Us_selo_verificacao = ?,
                    Us_nivel = ?,
                    Us_xp_total = ?,
                    Us_dt_ultimo_acesso = ?,
                    Us_adm = ?,
                    Us_Imagem = ?
                WHERE Us_ID = ?
            `, [
                Us_nome,
                Us_email,
                Us_senha,
                Us_biografia,
                Us_selo_verificacao,
                Us_nivel,
                Us_xp_total,
                Us_dt_ultimo_acesso,
                Us_adm,
                Us_Imagem,
                Us_ID
            ]);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Usuário editado com sucesso.',
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


    async apagarUsuario(request, response) {

        try {

            const {
                Us_ID
            } = request.body;

            await db.query(`
                DELETE FROM USUARIO
                WHERE Us_ID = ?
            `, [
                Us_ID
            ]);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Usuário apagado com sucesso.',
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

}