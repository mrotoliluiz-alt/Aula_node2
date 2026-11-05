
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

// Função que cria a configuração do Multer
const uploadImagem = (pastaDestino) => {

    // Verifica se a pasta de destino foi informada
    if (!pastaDestino) {
        throw new Error('O nome da pasta de destino é obrigatório.');
    }

    const caminhoCompleto = path.join(
        process.cwd(),
        'public',
        pastaDestino
    );

    // Cria a pasta caso ela ainda não exista
    fs.ensureDirSync(caminhoCompleto);

    // Configuração do armazenamento
    const storage = multer.diskStorage({

        destination: function (request, file, callback) {
            callback(null, caminhoCompleto);
        },

        filename: function (request, file, callback) {

            const nomeUnico = Date.now() + '-' +
                Math.round(Math.random() * 1E9);

            const extensao = path.extname(file.originalname).toLowerCase();

            callback(null, `${nomeUnico}${extensao}`);
        }
    });

    // Filtro para aceitar apenas imagens
    const fileFilter = (request, file, callback) => {

        if (
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/gif'
        ) {

            callback(null, true);

        } else {

            callback(
                new Error('Formato de imagem não suportado! Use JPEG, JPG, PNG ou GIF.'),
                false
            );
        }
    };

    // Retorna o Multer configurado
    return multer({
        storage: storage,
        limits: {
            fileSize: 5 * 1024 * 1024
        },
        fileFilter: fileFilter
    });
};

module.exports = uploadImagem;
