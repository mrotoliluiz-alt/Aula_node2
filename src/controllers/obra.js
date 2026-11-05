
const db = require('../database/connection');

const { gerarUrl } = require('../utils/gerar_imagens/gerarUrl');

const uploadImagem = require('../../middleware/uploadHelper');

const uploadObras = uploadImagem('obras');

function gerarUrlObra(nomeArquivo) {
    if (!nomeArquivo) {
        return null;
    }

    return gerarUrl(nomeArquivo, 'obras', nomeArquivo);
}

module.exports = {

    async listarObras(request, response) {
        try {
            const { titulo, page = 1, limit = 5 } = request.query;

            const pagina = parseInt(page);
            const limite = parseInt(limit);
            const offset = (pagina - 1) * limite;

            if (
                !Number.isInteger(pagina) ||
                !Number.isInteger(limite) ||
                pagina < 1 ||
                limite < 1
            ) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Página e limite devem ser números inteiros positivos.',
                    dados: null
                });
            }

            const countQuery = `
                SELECT COUNT(*) AS total
                FROM OBRA
                WHERE Ob_titulo LIKE ?
            `;

            const countValues = [`%${titulo ?? ''}%`];

            const [[{ total }]] = await db.query(countQuery, countValues);

            const listQuery = `
                SELECT
                    OBRA.Ob_ID,
                    OBRA.Ob_titulo AS Obra,
                    USUARIO.US_nome AS Autor,
                    OBRA.Ob_genero AS Genero,
                    OBRA.Ob_imagem AS Imagem,
                    OBRA.Ob_sinopse AS Sinopse,
                    COUNT(CAPITULO.Cap_ID) AS Quantidade_Capitulos
                FROM OBRA
                INNER JOIN USUARIO
                    ON OBRA.Us_ID = USUARIO.Us_ID
                LEFT JOIN CAPITULO
                    ON OBRA.Ob_ID = CAPITULO.Ob_ID
                WHERE OBRA.Ob_titulo LIKE ?
                GROUP BY
                    OBRA.Ob_ID,
                    OBRA.Ob_titulo,
                    USUARIO.US_nome,
                    OBRA.Ob_genero,
                    OBRA.Ob_imagem,
                    OBRA.Ob_sinopse
                ORDER BY OBRA.Ob_ID
                LIMIT ?, ?
            `;

            const listValues = [
                `%${titulo ?? ''}%`,
                offset,
                limite
            ];

            const [obras] = await db.query(listQuery, listValues);

            const dados = obras.map(obra => ({
                id: obra.Ob_ID,
                titulo: obra.Obra,
                autor: obra.Autor,
                sinopse: obra.Sinopse,
                imagem: gerarUrlObra(obra.Imagem),
                genero: obra.Genero,
                capitulos: obra.Quantidade_Capitulos
            }));

            response.setHeader('X-Total-Count', total);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de obras consultada com sucesso.',
                nItens: dados.length,
                total,
                dados
            });

        } catch (error) {
            console.error('Erro ao listar obras:', error);

            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar obras.',
                dados: error.message
            });
        }
    },


    async cadastrarObra(request, response) {
        try {
            const {
                Us_ID,
                Ob_titulo,
                Ob_sinopse,
                Ob_genero,
                Ob_status,
            } = request.body;

            const Ob_imagem = request.file
            ? request.file.filename
            : request.body.Ob_imagem ?? null;

            if (!Us_ID || !Ob_titulo) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O ID do autor e o título da obra são obrigatórios.',
                    dados: null
                });
            }

            const [resultado] = await db.query(
                `INSERT INTO OBRA
                (Us_ID, Ob_titulo, Ob_sinopse, Ob_genero, Ob_status, Ob_imagem)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    Us_ID,
                    Ob_titulo,
                    Ob_sinopse ?? null,
                    Ob_genero ?? null,
                    Ob_status ?? null,
                    Ob_imagem ?? null
                ]
            );

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Obra cadastrada com sucesso.',
                dados: {
                    Ob_ID: resultado.insertId,
                    Us_ID,
                    Ob_titulo,
                    Ob_sinopse: Ob_sinopse ?? null,
                    Ob_genero: Ob_genero ?? null,
                    Ob_status: Ob_status ?? null,
                    Ob_imagem: gerarUrlObra(Ob_imagem)
                }
            });

        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Autor não encontrado. Verifique o ID informado.',
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

            const imagemAtualizada = request.file
            ? request.file.filename
            : Ob_imagem;

            const campos = {
                Us_ID,
                Ob_titulo,
                Ob_sinopse,
                Ob_genero,
                Ob_status,
                Ob_imagem: imagemAtualizada
            };

            const camposAtualizar = [];
            const values = [];

            for (const campo in campos) {
                if (campos[campo] !== undefined) {
                    camposAtualizar.push(`${campo} = ?`);
                    values.push(campos[campo]);
                }
            }

            if (camposAtualizar.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Nenhum campo foi informado para atualização.',
                    dados: null
                });
            }

            const sql = `
                UPDATE OBRA
                SET ${camposAtualizar.join(', ')}
                WHERE Ob_ID = ?
            `;

            values.push(id);

            const [resultado] = await db.query(sql, values);

            if (resultado.affectedRows === 0) {
                const [rows] = await db.query(
                    'SELECT Ob_ID FROM OBRA WHERE Ob_ID = ?',
                    [id]
                );

                if (rows.length === 0) {
                    return response.status(404).json({
                        sucesso: false,
                        mensagem: `Obra ${id} não encontrada.`,
                        dados: null
                    });
                }
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Obra editada com sucesso.',
                dados: {
                    Ob_ID: id,
                    camposAtualizados: camposAtualizar.length
                }
            });

        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Autor não encontrado. Verifique o ID informado.',
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


    async apagarObra(request, response) {
        try {
            const { id } = request.params;

            const [resultado] = await db.query(
                'DELETE FROM OBRA WHERE Ob_ID = ?',
                [id]
            );

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Obra ${id} não encontrada.`,
                    dados: null
                });
            }

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
            const { genero } = request.query;

            const Ob_genero = genero ? `%${genero}%` : '%';

            const sql = `
                SELECT
                    Ob_ID,
                    Ob_titulo,
                    Ob_sinopse,
                    Ob_status,
                    Ob_imagem
                FROM OBRA
                WHERE Ob_genero LIKE ?
            `;

            const values = [Ob_genero];

            const [rows] = await db.query(sql, values);

            const nItens = rows.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Obras por gênero consultadas com sucesso.',
                nItens,
                dados: rows.map(obra => ({...obra,
                        Ob_imagem: gerarUrlObra(obra.Ob_imagem)
                    }))
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },


    async listarQntCapitulo(request, response) {
        try {
            const { id, Obra } = request.query;

            const sql = `
                SELECT
                    O.Ob_ID,
                    O.Ob_titulo AS Obra,
                    COUNT(C.Cap_ID) AS Quantidade_Capitulos
                FROM OBRA O
                LEFT JOIN CAPITULO C
                    ON O.Ob_ID = C.Ob_ID
                WHERE O.Ob_titulo LIKE ?
                ${id ? 'AND O.Ob_ID = ?' : ''}
                GROUP BY O.Ob_ID, O.Ob_titulo
                ORDER BY O.Ob_ID
            `;

            const values = id
                ? [`%${Obra ?? ''}%`, id]
                : [`%${Obra ?? ''}%`];

            const [rows] = await db.query(sql, values);

            const dados = rows.map(obra => ({
                id: obra.Ob_ID,
                titulo: obra.Obra,
                Capitulos: obra.Quantidade_Capitulos
            }));

            const nItens = dados.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Quantidade de capítulos consultada com sucesso.',
                nItens,
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
                dados: {...rows[0],
                Ob_imagem: gerarUrlObra(rows[0].Ob_imagem)
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
