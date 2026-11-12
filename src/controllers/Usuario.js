
const db = require('../database/connection');

const bcrypt = require('bcrypt');

const { validarEmail } = require('../utils/validacoesusuarios');

const { gerarUrl } = require('../utils/gerar_imagens/gerarUrl');


module.exports = {


    // LISTAR USUÁRIOS
    async listarUsuarios(request, response) {
        try {

            const sql = `
                SELECT
                    Us_ID,
                    US_nome,
                    Us_email,
                    Us_biografia,
                    Us_SV,
                    Us_nivel,
                    Us_XP_total,
                    Us_dt_ultimo_acesso,
                    Us_adm,
                    Us_imagem
                FROM USUARIO
            `;

            const [rows] = await db.query(sql);

            // Gera a URL da imagem de cada usuário
            const dados = rows.map(usuario => ({
                ...usuario,
                Us_imagem: gerarUrl(
                    usuario.Us_imagem,
                    'usuarios',
                    'sem.jpg'
                )
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de usuários.',
                itens: rows.length,
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


    // CADASTRAR USUÁRIO
    async cadastrarUsuario(request, response) {
        try {

            const {
                US_nome,
                Us_email,
                Us_senha,
                Us_imagem,
                Us_nivel
            } = request.body;

            // Recebe a imagem enviada pelo formulário
            const imagem = request.file
                ? request.file.filename
                : (Us_imagem ?? null);

            // Validação dos campos obrigatórios
            if (!US_nome || !Us_email || !Us_senha) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Nome, e-mail e senha são obrigatórios.',
                    dados: null
                });
            }

            // Validação do e-mail
            if (!validarEmail(Us_email)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'E-mail inválido.',
                    dados: null
                });
            }

            // Verifica se o e-mail já existe
            const sqlEmail = `
                SELECT Us_ID
                FROM USUARIO
                WHERE Us_email = ?
            `;

            const [emailExiste] = await db.query(sqlEmail, [Us_email]);

            if (emailExiste.length > 0) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: 'E-mail já cadastrado.',
                    dados: null
                });
            }

            // Criptografa a senha
            const salt = await bcrypt.genSalt(10);
            const senhaCriptografada = await bcrypt.hash(Us_senha, salt);

            const sql = `
            INSERT INTO USUARIO (
                US_nome,
                Us_email,
                Us_senha,
                Us_imagem,
                Us_nivel,
                Us_dt_ultimo_acesso
            )
            VALUES (?, ?, ?, ?, ?, NOW())
        `;

            const values = [
                US_nome,
                Us_email,
                senhaCriptografada,
                imagem,
                1
            ];

            const [result] = await db.query(sql, values);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Usuário cadastrado com sucesso.',
                dados: {
                    id: result.insertId,
                    nome: US_nome,
                    email: Us_email,
                    imagem: gerarUrl(
                        imagem,
                        'usuarios',
                        'sem.jpg'
                    )
                }
            });

        } catch (error) {

            if (error.code === 'ER_DUP_ENTRY') {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: 'E-mail já cadastrado.',
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


    // EDITAR USUÁRIO
    async editarUsuario(request, response) {
        try {

            const {
                US_nome,
                Us_email,
                Us_senha,
                Us_biografia,
                Us_SV,
                Us_nivel,
                Us_XP_total,
                Us_dt_ultimo_acesso,
                Us_adm,
                Us_imagem
            } = request.body;

            const { id } = request.params;

            // Recebe a nova imagem, caso tenha sido enviada
            const imagem = request.file
                ? request.file.filename
                : Us_imagem;

            // Campos que podem ser atualizados
            const campos = {
                US_nome,
                Us_email,
                Us_senha,
                Us_biografia,
                Us_SV,
                Us_nivel,
                Us_XP_total,
                Us_dt_ultimo_acesso,
                Us_adm,
                Us_imagem: imagem
            };

            const camposAtualizar = [];
            const valores = [];

            // UPDATE dinâmico: atualiza somente os campos enviados
            for (const campo in campos) {

                if (campos[campo] !== undefined) {

                    let valor = campos[campo];

                    // Valida o e-mail
                    if (campo === 'Us_email') {

                        if (!validarEmail(valor)) {
                            return response.status(400).json({
                                sucesso: false,
                                mensagem: 'E-mail inválido.',
                                dados: null
                            });
                        }

                        const sqlEmail = `
                            SELECT Us_ID
                            FROM USUARIO
                            WHERE Us_email = ? AND Us_ID <> ?
                        `;

                        const [emailExiste] = await db.query(
                            sqlEmail,
                            [valor, id]
                        );

                        if (emailExiste.length > 0) {
                            return response.status(409).json({
                                sucesso: false,
                                mensagem: 'E-mail já cadastrado.',
                                dados: null
                            });
                        }
                    }

                    // Criptografa a senha caso ela seja alterada
                    if (campo === 'Us_senha') {

                        const salt = await bcrypt.genSalt(10);
                        valor = await bcrypt.hash(valor, salt);

                    }

                    camposAtualizar.push(`${campo} = ?`);
                    valores.push(valor);

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
                UPDATE USUARIO
                SET ${camposAtualizar.join(', ')}
                WHERE Us_ID = ?
            `;

            valores.push(id);

            const [result] = await db.query(sql, valores);

            if (result.affectedRows === 0) {

                const [usuarioExiste] = await db.query(
                    'SELECT Us_ID FROM USUARIO WHERE Us_ID = ?',
                    [id]
                );

                if (usuarioExiste.length === 0) {
                    return response.status(404).json({
                        sucesso: false,
                        mensagem: `Usuário ${id} não encontrado!`,
                        dados: null
                    });
                }
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${id} editado com sucesso!`,
                dados: {
                    id,
                    camposAtualizados: camposAtualizar.length,
                    imagem: request.file
                        ? gerarUrl(imagem, 'usuarios', 'sem.jpg')
                        : undefined
                }
            });

        } catch (error) {

            if (error.code === 'ER_DUP_ENTRY') {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: 'E-mail já cadastrado.',
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


    // APAGAR USUÁRIO
    async apagarUsuario(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                DELETE FROM USUARIO
                WHERE Us_ID = ?
            `;

            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Usuário ${id} não encontrado!`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${id} apagado com sucesso.`,
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


    // LOGIN
    async login(request, response) {
        try {
            const { email, senha } = request.query;

            const sql = `
                SELECT
                    Us_ID,
                    US_nome,
                    Us_email,
                    Us_senha,
                    Us_adm,
                    Us_imagem
                FROM USUARIO
                WHERE Us_email = ?
            `;

            const values = [email];

            const [rows] = await db.query(sql, values);

            console.log("E-mail recebido:", email);
            console.log("Quantidade de usuários encontrados:", rows.length);

            if (rows.length < 1) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Login ou senha inválidos.',
                    dados: null
                });
            }

            // Compara a senha informada com a senha criptografada
            const senhaValida = await bcrypt.compare(
                senha,
                rows[0].Us_senha
            );

            console.log("Senha válida:", senhaValida);

            if (!senhaValida) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Login ou senha inválidos.',
                    dados: null
                });
            }

            const usuario = rows[0];

            const dados = {
                id: usuario.Us_ID,
                nome: usuario.US_nome,
                tipo: usuario.Us_adm,
                imagem: gerarUrl(
                    usuario.Us_imagem,
                    'usuarios',
                    'sem.jpg'
                )
            };

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Login efetuado com sucesso.',
                dados
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
