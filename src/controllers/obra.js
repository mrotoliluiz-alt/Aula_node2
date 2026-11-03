const db = require('../database/connection');

module.exports = {

    // LISTAR OBRAS
    async listarObras(request, response) {
        try {
            const { titulo, page = 1, limit = 5} = request.query;
            const offset = (parseInt(page) - 1) * parseInt(limit); 

            const countQuery = `
            SELECT COUNT(*) AS total FROM obra 
                WHERE Ob_titulo LIKE ?`;
            
            const countValues = [`%${titulo ?? ''}%`];
            const [[{ total }]] = await db.query(countQuery, countValues);




            const listQuery = `
            SELECT
                OBRA.Ob_ID,
                OBRA.Ob_titulo AS Obra,
                USUARIO.Us_nome AS Autor,
                OBRA.Ob_genero AS Genero,
                OBRA.Ob_imagem AS Imagem,
                OBRA.Ob_sinopse AS Sinopse,
                COUNT(CAPITULO.Cap_ID) AS Quantidade_Capitulos
            FROM OBRA
            INNER JOIN USUARIO
                ON OBRA.Us_ID = USUARIO.Us_ID
            LEFT JOIN CAPITULO
                ON OBRA.Ob_ID = CAPITULO.Ob_ID
            WHERE
                OBRA.Ob_titulo like ?
            GROUP BY
                OBRA.Ob_ID,
                OBRA.Ob_titulo,
                USUARIO.Us_nome,
                OBRA.Ob_genero
            ORDER BY OBRA.Ob_ID
            LIMIT ?, ?
            `;

            const listValues =
                [`%${titulo ?? ''}%`, offset, parseInt(limit)];
               

            const [obras] = await db.query( listQuery, listValues);

            const dados = obras.map(obra => ({
                id: obra.Ob_ID,
                titulo: obra.Obra,
                autor: obra.Autor,
                sinopse: obra.Sinopse,
                imagem: obra.Imagem,
                genero: obra.Genero,
                capitulos: obra.Quantidade_Capitulos               
            }))

            response.setHeader('X-Total-Count', total);
            return response.status(200).json({
                sucesso: true,
                mensagem: `lista de livros`,
                nItens: dados.length,
                dados
            });

        } catch (error) {
            console.error('Erro ao listar obras:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar obras.',
                dados: error.message
            })

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
    },

    async listarGeneros(request, response) {
        try {
            const {genero} = request.query;

            const Ob_genero = genero ? `%${genero}%` : `%`;
            const sql = `
            SELECT
                Ob_ID, Ob_titulo, Ob_sinopse, Ob_status,
                Ob_imagem
            FROM
                obra
            WHERE
                Ob_genero like ?;
            `;

            const values = [Ob_genero];

            const [rows] = await db.query(sql, values);
            const nItens = rows.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: `Livros por genero`,
                nItens,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            })

        }
    },

    async listarQntCapitulo(request, response) {
        try {
            const {id, Obra} = request.query;

            

            const sql = `
            SELECT
                O.Ob_ID,
                O.Ob_titulo AS Obra,
                COUNT(C.Cap_ID) AS Quantidade_Capitulos
            FROM OBRA O
            LEFT JOIN CAPITULO C
                ON O.Ob_ID = C.Ob_ID
            WHERE
            O.Ob_titulo LIKE ? 
            ${id ? ' AND O.Ob_ID = ?' : ''}
            GROUP BY O.Ob_ID, O.Ob_titulo
            ORDER BY O.Ob_ID
            `;

            const values = id 
            [`%${Obra ?? ''}%`, id];
        

            const [rows] = await db.query(sql, values);

            const dados = rows.map(Obra => ({
                id: Obra.Ob_ID,
                titulo: Obra.Obra,
                Capitulos:Obra.Quantidade_Capitulos
            }));
            const nItens = rows.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'lista de capitulos',//dados.length > 0 
                //?'capitulos da obras encontrados'
                //: 'Nenhum capitulo encontrado',
                nItens,
                dados
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            })

        }
    },

    // 1. LISTAR OBRA DETALHADA POR ID
    async listarObraDetalhada(request, response) {
        try {
            const { id } = request.params;

            const sql = `
                SELECT
                    O.Ob_ID,
                    O.Ob_titulo,
                    O.Ob_sinopse,
                    O.Ob_genero,
                    O.Ob_status,
                    O.Ob_imagem,
                    U.US_nome AS Autor,
                    COUNT(C.Cap_ID) AS Quantidade_Capitulos
                FROM OBRA O
                INNER JOIN USUARIO U
                    ON O.Us_ID = U.Us_ID
                LEFT JOIN CAPITULO C
                    ON O.Ob_ID = C.Ob_ID
                WHERE O.Ob_ID = ?
                GROUP BY
                    O.Ob_ID,
                    O.Ob_titulo,
                    O.Ob_sinopse,
                    O.Ob_genero,
                    O.Ob_status,
                    O.Ob_imagem,
                    U.US_nome
            `;

            const [rows] = await db.query(sql, [id]);

            if (rows.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Obra não encontrada.',
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Obra detalhada consultada com sucesso.',
                dados: rows[0]
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    // 2. LISTAR OBRAS DE UM USUÁRIO
    async listarObrasUsuario(request, response) {
        try {
            const { id } = request.params;

            const sql = `
                SELECT
                    Ob_ID,
                    Us_ID,
                    Ob_titulo,
                    Ob_sinopse,
                    Ob_genero,
                    Ob_status,
                    Ob_imagem
                FROM OBRA
                WHERE Us_ID = ?
                ORDER BY Ob_ID
            `;

            const [rows] = await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: rows.length > 0
                    ? 'Obras do usuário encontradas com sucesso.'
                    : 'Nenhuma obra encontrada para este usuário.',
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

    // 3. LISTAR OBRAS SALVAS/FAVORITADAS PELOS USUÁRIOS
    async listarObrasFavoritas(request, response) {
        try {
            const sql = `
                SELECT
                    F.Us_ID,
                    U.US_nome AS Usuario,
                    O.Ob_ID,
                    O.Ob_titulo,
                    O.Ob_genero,
                    O.Ob_imagem,
                    F.Fav_status,
                    F.Ob_PagAtual
                FROM FAVORITOS_SALVOS F
                INNER JOIN OBRA O
                    ON F.Ob_ID = O.Ob_ID
                INNER JOIN USUARIO U
                    ON F.Us_ID = U.Us_ID
                ORDER BY O.Ob_titulo
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Obras salvas pelos usuários consultadas com sucesso.',
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

    // 4. LISTAR OBRAS COM MAIOR QUANTIDADE DE COMENTÁRIOS
    async listarObrasMaisComentadas(request, response) {
        try {
            const sql = `
                SELECT
                    O.Ob_ID,
                    O.Ob_titulo,
                    O.Ob_genero,
                    COUNT(C.Com_ID) AS Quantidade_Comentarios
                FROM OBRA O
                LEFT JOIN COMENTARIO_OBRA C
                    ON O.Ob_ID = C.Ob_ID
                GROUP BY
                    O.Ob_ID,
                    O.Ob_titulo,
                    O.Ob_genero
                ORDER BY Quantidade_Comentarios DESC
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Obras organizadas pela quantidade de comentários.',
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
