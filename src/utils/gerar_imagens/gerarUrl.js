
const fs = require('fs-extra');
const path = require('path');

const PUBLIC_ROOT_PATH = path.join(process.cwd(), 'public');

const API_URL = process.env.API_BASE_URL || 'http://localhost:3333';

function gerarUrl(nomeArquivo, pasta, arquivoPadrao) {

    const arquivoVerificar = nomeArquivo || arquivoPadrao;

    const caminhoFisico = path.join(
        PUBLIC_ROOT_PATH,
        pasta,
        arquivoVerificar
    );

    let caminhoRelativo;

    // Verifica se o arquivo informado existe
    if (nomeArquivo && fs.existsSync(caminhoFisico)) {

        caminhoRelativo = path.join(
            '/public',
            pasta,
            nomeArquivo
        );

    } else {

        // Utiliza a imagem padrão caso não exista
        caminhoRelativo = path.join(
            '/public',
            pasta,
            arquivoPadrao
        );
    }

    // Padroniza as barras do caminho
    const caminhoRelativoFormatado = caminhoRelativo.replace(/\\/g, '/');

    // Gera a URL completa
    const urlCompleta = new URL(
        caminhoRelativoFormatado,
        API_URL
    );

    return urlCompleta.href;
}

module.exports = { gerarUrl };
