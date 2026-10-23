
const db = require('../database/connection');

module.exports = {

    async listarSeguindo(request, response) {

        try {

            const {Us_ID, seguindo} = request.query;

            if (!Us_ID) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O (id do usuario) é obrigatório para ver quem ele está seguindo.',
                });
            }

            const Seguindo = seguindo ? `%${seguindo}%` :`%`;

            //Consulta sql 2 parametros
            const SQL_LISTAR_SEGUIDORES = `
            SELECT
                Us_ID, Seguindo
            FROM
                seguindo
            WHERE
                Us_ID = ? AND Seguindo LIKE ?;`;

            const values = [Us_ID.toUpperCase(), Seguindo];
            const [rows] = await db.query(SQL_LISTAR_SEGUIDORES, values);

            const dados = rows.map(seguidor => ({
                Us_ID: seguidor.Us_ID,
                Seguindo: seguidor.Seguindo
            }));

            return response.status(200).json({
                sucesso:true,
                mensagem: dados.length > 0
                    ? 'Lista de seguidores encontrados com sucesso.'
                    : 'Nenhum seguidor encontrado com os critérios fornecidos.',
                nItens: dados.length,
                dados
            });

        } catch (error) {
            console.error('Erro na requisição', error);
            return response.status(500).json({

                sucesso: false,
                mensagem: 'Erro interno na requisição.',
                dados: error.message

            });

        }

    },


    async cadastrarSeguindo(request, response) {

        try {

            const {
                Us_ID,
                Seguindo
            } = request.body;

            const sql = `
                INSERT INTO SEGUINDO (
                    Us_ID,
                    Seguindo
                )
                VALUES (?, ?)
            `;

            const values = [
                Us_ID,
                Seguindo
            ];

            const [result] = await db.query(sql, values);

            const dados = {
                Us_ID,
                Seguindo
            };

            return response.status(201).json({

                sucesso: true,
                mensagem: 'Usuário seguido com sucesso.',
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


   



async editarSeguindo(request, response) {
    try {
        const { Us_ID: id } = request.params;
        const { Us_ID, Seguindo } = request.body;

        const sql = `
            UPDATE SEGUINDO
            SET Seguindo = ?
            WHERE Us_ID = ?
            AND Seguindo = ?
        `;

        const values = [
            Seguindo,
            Us_ID,
            id
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return response.status(404).json({
                sucesso: false,
                mensagem: 'Vínculo não encontrado.',
                dados: null
            });
        }

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Seguindo editado com sucesso.',
            dados: {
                Us_ID,
                Seguindo
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






    async apagarSeguindo(request, response) {

        try {

            const { id } = request.params;

            const sql = `
                DELETE FROM SEGUINDO
                WHERE Us_ID = ?
            `;

            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {

                return response.status(404).json({

                    sucesso: false,
                    mensagem: `Registro do usuário ${id} não encontrado.`,
                    dados: null

                });

            }

            return response.status(200).json({

                sucesso: true,
                mensagem: `Registro do usuário ${id} apagado com sucesso.`,
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

};
