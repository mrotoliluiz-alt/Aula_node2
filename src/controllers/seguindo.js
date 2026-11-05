
const db = require('../database/connection');

module.exports = {

    async listarSeguindo(request, response) {
        try {
            const { Us_ID, seguindo } = request.query;

            if (!Us_ID) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O ID do usuário é obrigatório para ver quem ele está seguindo.',
                    dados: null
                });
            }

            const Seguindo = seguindo ? `%${seguindo}%` : '%';

            const SQL_LISTAR_SEGUIDORES = `
                SELECT
                    Us_ID,
                    Seguindo
                FROM SEGUINDO
                WHERE Us_ID = ?
                AND Seguindo LIKE ?
            `;

            const values = [Us_ID, Seguindo];
            const [rows] = await db.query(SQL_LISTAR_SEGUIDORES, values);

            const dados = rows.map(seguidor => ({
                Us_ID: seguidor.Us_ID,
                Seguindo: seguidor.Seguindo
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: dados.length > 0
                    ? 'Lista de usuários seguidos encontrada com sucesso.'
                    : 'Nenhum usuário encontrado com os critérios fornecidos.',
                itens: dados.length,
                dados
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
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

            if (!Us_ID || !Seguindo) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O ID do usuário e o ID do usuário seguido são obrigatórios.',
                    dados: null
                });
            }

            if (Number(Us_ID) === Number(Seguindo)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Um usuário não pode seguir a si mesmo.',
                    dados: null
                });
            }

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

            await db.query(sql, values);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Usuário seguido com sucesso.',
                dados: {
                    Us_ID,
                    Seguindo
                }
            });

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: 'Este usuário já está sendo seguido.',
                    dados: null
                });
            }

            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado. Verifique os IDs informados.',
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


    async editarSeguindo(request, response) {
        try {
            const { idUsuario, idSeguindo } = request.params;
            const { Seguindo } = request.body;

            if (!Seguindo) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O ID do novo usuário seguido é obrigatório.',
                    dados: null
                });
            }

            if (Number(idUsuario) === Number(Seguindo)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Um usuário não pode seguir a si mesmo.',
                    dados: null
                });
            }

            const sql = `
                UPDATE SEGUINDO
                SET Seguindo = ?
                WHERE Us_ID = ?
                AND Seguindo = ?
            `;

            const values = [
                Seguindo,
                idUsuario,
                idSeguindo
            ];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                const sqlVerificar = `
                    SELECT Us_ID
                    FROM SEGUINDO
                    WHERE Us_ID = ?
                    AND Seguindo = ?
                `;

                const [rows] = await db.query(sqlVerificar, [
                    idUsuario,
                    idSeguindo
                ]);

                if (rows.length === 0) {
                    return response.status(404).json({
                        sucesso: false,
                        mensagem: 'Vínculo não encontrado.',
                        dados: null
                    });
                }
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Seguindo editado com sucesso.',
                dados: {
                    Us_ID: idUsuario,
                    Seguindo
                }
            });

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: 'Este vínculo já existe.',
                    dados: null
                });
            }

            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado. Verifique o ID informado.',
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


    async apagarSeguindo(request, response) {
        try {
            const { idUsuario, idSeguindo } = request.params;

            const sql = `
                DELETE FROM SEGUINDO
                WHERE Us_ID = ?
                AND Seguindo = ?
            `;

            const values = [
                idUsuario,
                idSeguindo
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
                mensagem: 'Vínculo apagado com sucesso.',
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


    async listarSeguindoDetalhado(request, response) {
        try {
            const { id } = request.params;

            const sql = `
                SELECT
                    S.Us_ID,
                    U1.US_nome AS Usuario,
                    S.Seguindo,
                    U2.US_nome AS UsuarioSeguido
                FROM SEGUINDO S
                INNER JOIN USUARIO U1
                    ON S.Us_ID = U1.Us_ID
                INNER JOIN USUARIO U2
                    ON S.Seguindo = U2.Us_ID
                WHERE S.Us_ID = ?
            `;

            const [rows] = await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: rows.length > 0
                    ? 'Lista de usuários seguidos encontrada com sucesso.'
                    : 'Nenhum usuário seguido encontrado.',
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


    async listarSeguidores(request, response) {
        try {
            const { id } = request.params;

            const sql = `
                SELECT
                    S.Us_ID,
                    U.US_nome AS NomeSeguidor,
                    S.Seguindo
                FROM SEGUINDO S
                INNER JOIN USUARIO U
                    ON S.Us_ID = U.Us_ID
                WHERE S.Seguindo = ?
            `;

            const [rows] = await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: rows.length > 0
                    ? 'Lista de seguidores encontrada com sucesso.'
                    : 'Nenhum seguidor encontrado.',
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


    async listarQuantidadeSeguindo(request, response) {
        try {
            const sql = `
                SELECT
                    U.Us_ID,
                    U.US_nome,
                    COUNT(S.Seguindo) AS QuantidadeSeguindo
                FROM USUARIO U
                LEFT JOIN SEGUINDO S
                    ON U.Us_ID = S.Us_ID
                GROUP BY U.Us_ID, U.US_nome
                ORDER BY QuantidadeSeguindo DESC
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Quantidade de usuários seguidos consultada com sucesso.',
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


    async listarQuantidadeSeguidores(request, response) {
        try {
            const sql = `
                SELECT
                    U.Us_ID,
                    U.US_nome,
                    COUNT(S.Us_ID) AS QuantidadeSeguidores
                FROM USUARIO U
                LEFT JOIN SEGUINDO S
                    ON U.Us_ID = S.Seguindo
                GROUP BY U.Us_ID, U.US_nome
                ORDER BY QuantidadeSeguidores DESC
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Quantidade de seguidores consultada com sucesso.',
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
