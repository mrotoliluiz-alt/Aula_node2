const db = require('../database/connection');

module.exports = {

    async listarUsuarios(request, response) {

        try {

            const sql = `SELECT 
            Us_ID, US_nome, Us_email, Us_senha, Us_biografia, Us_SV, Us_nivel,
            Us_XP_total, Us_dt_ultimo_acesso, Us_adm, Us_imagem
            FROM USUARIO`;

            const [rows] = await db.query(sql);

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Lista de usuários.',
                itens: rows.lenght,
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


    
async cadastrarUsuario(request, response) {
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

       const sql = `
    INSERT INTO USUARIO (
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
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

        const values = [
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
];

        const [result] = await db.query(sql, values);

        const dados = {
            id: result.insertId,
            nome: US_nome,
            email: Us_email
        };

        return response.status(201).json({
            sucesso: true,
            mensagem: 'Usuário cadastrado com sucesso.',
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

        const sql = `
            UPDATE USUARIO
            SET
                US_nome = ?,
                Us_email = ?,
                Us_senha = ?,
                Us_biografia = ?,
                Us_SV = ?,
                Us_nivel = ?,
                Us_XP_total = ?,
                Us_dt_ultimo_acesso = ?,
                Us_adm = ?,
                Us_imagem = ?
            WHERE Us_ID = ?
        `;

        const values = [
            US_nome,
            Us_email,
            Us_senha,
            Us_biografia,
            Us_SV,
            Us_nivel,
            Us_XP_total,
            Us_dt_ultimo_acesso,
            Us_adm,
            Us_imagem,
            id
        ];

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
            mensagem: `Usuário ${id} editado com sucesso!`,
            dados: {
                id,
                nome: US_nome,
                email: Us_email
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


    async apagarUsuario(request, response) {

        try {

            const {id} = request.params;

            const sql = `DELETE FROM usuario WHERE Us_ID = ?`;

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

    async login(request, response){
        try{
            const {email, senha } = request.query;

            const sql = `SELECT
            Us_ID, Us_nome, Us_adm, Us_imagem
            FROM
            usuario
            WHERE
            Us_email = ? AND Us_senha = ?;
            `;

            const values = [email, senha];

            const [rows] = await db.query(sql, values);
            const nItens = rows.length;

            if (nItens < 1){
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Login ou senha inválidos.',
                    dados: null,
                });
            }

            const dados = rows.map( usuario => ({
                id: usuario.Us_ID,
                nome: usuario.Us_nome,
                tipo: usuario.Us_adm,
                imagem: usuario.Us_imagem
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Login efetuado com sucesso',
                dados
            });           
        }catch (error) {
                return response.status(500).json({
                    sucesso: false,
                    mensagem: 'Erro na requisição.',
                    dados: error.message
                })
            }
    },

}