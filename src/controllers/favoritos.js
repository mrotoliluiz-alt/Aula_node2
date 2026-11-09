
const db = require('../database/connection');

module.exports = {
    async listarFavoritosSalvos(request, response) {
        try {

            const sql = `SELECT 
                Ob_ID, Us_ID, Fav_status, Ob_PagAtual
                FROM FAVORITOS_SALVOS`;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de favoritos salvos.',
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


    async cadastrarFavoritosSalvos(request, response) {
        try {

            const {
                Us_ID,
                Ob_ID,
                Fav_status,
                Ob_PagAtual
            } = request.body;

            if (!Us_ID || !Ob_ID) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe o ID do usuário e o ID da obra.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO FAVORITOS_SALVOS (
                    Us_ID,
                    Ob_ID,
                    Fav_status,
                    Ob_PagAtual
                )
                VALUES (?, ?, ?, ?)
            `;

            const values = [
                Us_ID,
                Ob_ID,
                Fav_status,
                Ob_PagAtual
            ];

            const [result] = await db.query(sql, values);

            const dados = {
                Us_ID,
                Ob_ID,
                Fav_status,
                Ob_PagAtual
            };

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Favorito salvo com sucesso.',
                dados: dados
            });

        } catch (error) {

            if (error.code === 'ER_DUP_ENTRY') {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: 'Esta obra já está salva nos favoritos deste usuário.',
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


    async editarFavoritosSalvos(request, response) {
        try {

            const {
                Us_ID,
                Fav_status,
                Ob_PagAtual
            } = request.body;

            const { id } = request.params;

            if (!Us_ID) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe o ID do usuário.',
                    dados: null
                });
            }

            const sql = `
                UPDATE FAVORITOS_SALVOS
                SET
                    Fav_status = ?,
                    Ob_PagAtual = ?
                WHERE Ob_ID = ? AND Us_ID = ?
            `;

            const values = [
                Fav_status,
                Ob_PagAtual,
                id,
                Us_ID
            ];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {

                const [rows] = await db.query(
                    `SELECT Ob_ID FROM FAVORITOS_SALVOS
                     WHERE Ob_ID = ? AND Us_ID = ?`,
                    [id, Us_ID]
                );

                if (rows.length === 0) {
                    return response.status(404).json({
                        sucesso: false,
                        mensagem: `Favorito da obra ${id} não encontrado para este usuário!`,
                        dados: null
                    });
                }
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Favorito da obra ${id} editado com sucesso.`,
                dados: {
                    Ob_ID: id,
                    Us_ID,
                    Fav_status,
                    Ob_PagAtual
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


    async apagarFavoritosSalvos(request, response) {
        try {

            const { id } = request.params;
            const { Us_ID } = request.body;

            if (!Us_ID) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe o ID do usuário.',
                    dados: null
                });
            }

            const sql = `
                DELETE FROM FAVORITOS_SALVOS
                WHERE Us_ID = ? AND Ob_ID = ?
            `;

            const values = [Us_ID, id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Obra favorita ${id} não encontrada para este usuário!`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Obra favorita ${id} apagada com sucesso.`,
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


    async listarFavoritosDetalhados(request, response) {
        try {

            const sql = `
                SELECT
                    F.Us_ID,
                    F.Ob_ID,
                    O.Ob_titulo AS Obra,
                    O.Ob_genero AS Genero,
                    U.US_nome AS Autor,
                    F.Fav_status,
                    F.Ob_PagAtual
                FROM FAVORITOS_SALVOS F
                INNER JOIN OBRA O
                    ON F.Ob_ID = O.Ob_ID
                INNER JOIN USUARIO U
                    ON O.Us_ID = U.Us_ID;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de favoritos detalhados.',
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


    // CONSULTA 2 — FAVORITOS DE UM USUÁRIO
    async listarFavoritosUsuario(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                SELECT
                    Ob_ID,
                    Us_ID,
                    Fav_status,
                    Ob_PagAtual
                FROM FAVORITOS_SALVOS
                WHERE Us_ID = ?;
            `;

            const values = [id];

            const [rows] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de favoritos do usuário.',
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


    // CONSULTA 3 — USUÁRIOS QUE SALVARAM UMA OBRA
    async listarUsuariosFavoritaramObra(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                SELECT
                    U.Us_ID,
                    U.US_nome,
                    F.Ob_ID,
                    F.Fav_status,
                    F.Ob_PagAtual
                FROM FAVORITOS_SALVOS F
                INNER JOIN USUARIO U
                    ON F.Us_ID = U.Us_ID
                WHERE F.Ob_ID = ?;
            `;

            const values = [id];

            const [rows] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de usuários que salvaram a obra.',
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


    // CONSULTA 4 — FAVORITOS POR STATUS
    async listarFavoritosStatus(request, response) {
        try {

            const { status } = request.params;

            const sql = `
                SELECT
                    Ob_ID,
                    Us_ID,
                    Fav_status,
                    Ob_PagAtual
                FROM FAVORITOS_SALVOS
                WHERE Fav_status = ?;
            `;

            const values = [status];

            const [rows] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de favoritos por status.',
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
