
const db = require('../database/connection');

module.exports = {

    // LISTAR CAPÍTULOS
    async listarCapitulos(request, response) {
        try {

            const sql = `
                SELECT 
                    c.Cap_ID,
                    o.Ob_titulo AS Titulo_Obra,
                    c.Cap_ordem AS Ordem,
                    c.Cap_titulo AS Titulo_Capitulo,
                    c.Cap_conteudo AS Conteudo
                FROM CAPITULO c
                INNER JOIN OBRA o
                    ON c.Ob_ID = o.Ob_ID
                ORDER BY o.Ob_titulo, c.Cap_ordem;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de capítulos.',
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


    // CADASTRAR CAPÍTULOS
    async cadastrarCapitulos(request, response) {
        try {

            const {
                Ob_ID,
                Cap_ordem,
                Cap_titulo,
                Cap_conteudo
            } = request.body;

            if (!Ob_ID || Cap_ordem == null || !Cap_titulo || !Cap_conteudo) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe a obra, a ordem, o título e o conteúdo do capítulo.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO CAPITULO (
                    Ob_ID,
                    Cap_ordem,
                    Cap_titulo,
                    Cap_conteudo
                )
                VALUES (?, ?, ?, ?)
            `;

            const values = [
                Ob_ID,
                Cap_ordem,
                Cap_titulo,
                Cap_conteudo
            ];

            const [result] = await db.query(sql, values);

            const dados = {
                Cap_ID: result.insertId,
                Ob_ID,
                Cap_ordem,
                Cap_titulo,
                Cap_conteudo
            };

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Capítulo cadastrado com sucesso.',
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


    // EDITAR CAPÍTULOS
    async editarCapitulos(request, response) {
        try {

            const {
                Ob_ID,
                Cap_ordem,
                Cap_titulo,
                Cap_conteudo
            } = request.body;

            const { id } = request.params;

            const campos = [];
            const values = [];

            if (Ob_ID !== undefined) {
                campos.push('Ob_ID = ?');
                values.push(Ob_ID);
            }

            if (Cap_ordem !== undefined) {
                campos.push('Cap_ordem = ?');
                values.push(Cap_ordem);
            }

            if (Cap_titulo !== undefined) {
                campos.push('Cap_titulo = ?');
                values.push(Cap_titulo);
            }

            if (Cap_conteudo !== undefined) {
                campos.push('Cap_conteudo = ?');
                values.push(Cap_conteudo);
            }

            if (campos.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe pelo menos um campo para atualizar.',
                    dados: null
                });
            }

            const sql = `
                UPDATE CAPITULO
                SET ${campos.join(', ')}
                WHERE Cap_ID = ?
            `;

            values.push(id);

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {

                const [capitulo] = await db.query(
                    'SELECT Cap_ID FROM CAPITULO WHERE Cap_ID = ?',
                    [id]
                );

                if (capitulo.length === 0) {
                    return response.status(404).json({
                        sucesso: false,
                        mensagem: `Capítulo ${id} não encontrado!`,
                        dados: null
                    });
                }
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Capítulo atualizado com sucesso.',
                dados: {
                    id,
                    Ob_ID,
                    Cap_ordem,
                    Cap_titulo,
                    Cap_conteudo
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


    // APAGAR CAPÍTULOS
    async apagarCapitulos(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                DELETE FROM CAPITULO
                WHERE Cap_ID = ?
            `;

            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Capítulo ${id} não encontrado!`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Capítulo ${id} apagado com sucesso.`,
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


    // LISTAR CAPÍTULOS DE UMA OBRA
    async listarCapitulosObra(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                SELECT
                    Cap_ID,
                    Cap_ordem,
                    Cap_titulo,
                    Cap_conteudo
                FROM CAPITULO
                WHERE Ob_ID = ?
                ORDER BY Cap_ordem;
            `;

            const values = [id];

            const [rows] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de capítulos da obra.',
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


    // QUANTIDADE DE CAPÍTULOS POR OBRA
    async listarQntCapitulo(request, response) {
        try {

            const sql = `
                SELECT
                    O.Ob_ID,
                    O.Ob_titulo,
                    COUNT(C.Cap_ID) AS Quantidade_Capitulos
                FROM OBRA O
                LEFT JOIN CAPITULO C
                    ON O.Ob_ID = C.Ob_ID
                GROUP BY O.Ob_ID, O.Ob_titulo
                ORDER BY O.Ob_ID;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Quantidade de capítulos por obra.',
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
