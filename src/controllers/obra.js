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
    }

};
