
const db = require('../database/connection');

module.exports = {

    async listarSeguindo(request, response) {
        try {
            const { Us_ID, seguindo } = request.query;

            if (!Us_ID) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O ID do usuário é obrigatório para ver quem ele está seguindo.',
                });
            }

            const Seguindo = seguindo ? `%${seguindo}%` : `%`;

            const SQL_LISTAR_SEGUIDORES = `
                SELECT
                    Us_ID, Seguindo
                FROM
                    SEGUINDO
                WHERE
                    Us_ID = ? AND Seguindo LIKE ?;
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

            await db.query(sql, values);

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
            const { id, seguindo } = request.params;

            const sql = `
                DELETE FROM SEGUINDO
                WHERE Us_ID = ?
                AND Seguindo = ?
            `;

            const values = [id, seguindo];

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

    // 1. Lista os usuários seguidos com seus nomes
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
                nItens: rows.length,
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

    // 2. Lista os seguidores de determinado usuário
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
                nItens: rows.length,
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

    // 3. Conta quantas pessoas cada usuário segue
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
                nItens: rows.length,
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

    // 4. Conta quantos seguidores cada usuário possui
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
                nItens: rows.length,
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
