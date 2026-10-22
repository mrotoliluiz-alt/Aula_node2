const express = require('express');

const router = express.Router();



const UsuariosController = require('../controllers/Usuario');

router.get('/usuarios', UsuariosController.listarUsuarios);

router.post('/usuarios', UsuariosController.cadastrarUsuario);

router.put('/usuarios/:id', UsuariosController.editarUsuario);

router.delete('/usuarios/:id', UsuariosController.apagarUsuario);

router.get('/login', UsuariosController.login); // query


const FavoritosSalvosController = require('../controllers/favoritos');

router.get('/favoritossalvos', FavoritosSalvosController.listarFavoritosSalvos);

router.post('/favoritossalvos', FavoritosSalvosController.cadastrarFavoritosSalvos);

router.put('/favoritossalvos/:id', FavoritosSalvosController.editarFavoritosSalvos);

router.delete('/favoritossalvos/:id', FavoritosSalvosController.apagarFavoritosSalvos);



const capitulosController = require('../controllers/capitulos');

router.get('/capitulos', capitulosController.listarCapitulos);

router.post('/capitulos', capitulosController.cadastrarCapitulos);

router.put('/capitulos/:id', capitulosController.editarCapitulos);

router.delete('/capitulos/:id', capitulosController.apagarCapitulos);



const usuarioMissaoController = require('../controllers/usuario_missao');

router.get('/usuario-missoes', usuarioMissaoController.listarUsuarioMissoes);

router.post('/usuario-missoes', usuarioMissaoController.cadastrarUsuarioMissao);

router.put('/usuario-missoes/:id', usuarioMissaoController.editarUsuarioMissao);

router.delete('/usuario-missoes/:id', usuarioMissaoController.apagarUsuarioMissao);



const obrasController = require('../controllers/obra');

router.get('/obras', obrasController.listarObras);

router.post('/obras', obrasController.cadastrarObra);

router.put('/obras/:id', obrasController.editarObra);

router.delete('/obras/:id', obrasController.apagarObra);

router.get('/genero', obrasController.listarGeneros);

router.get('/pesquisa', obrasController.buscaTitulo);


const missoesController = require('../controllers/missoes');

router.get('/missoes', missoesController.listarMissoes);

router.post('/missoes', missoesController.cadastrarMissao);

router.put('/missoes/:id', missoesController.editarMissao);

router.delete('/missoes/:id', missoesController.apagarMissao);



const comentariosController = require('../controllers/comentario_obra');

router.get('/comentarios', comentariosController.listarComentarios);

router.post('/comentarios', comentariosController.cadastrarComentario);

router.put('/comentarios/:id', comentariosController.editarComentario);

router.delete('/comentarios/:id', comentariosController.apagarComentario);



const chatController = require('../controllers/chat');

router.get('/chat', chatController.listarChat);

router.post('/chat', chatController.cadastrarChat);

router.put('/chat/:Chat_ID', chatController.editarChat);

router.delete('/chat/:Chat_ID', chatController.apagarChat);



const seguindoController = require('../controllers/seguindo');

router.get('/seguindo', seguindoController.listarSeguindo);

router.post('/seguindo', seguindoController.cadastrarSeguindo);

router.put('/seguindo/:Us_ID', seguindoController.editarSeguindo);

router.delete('/seguindo/:Us_ID', seguindoController.apagarSeguindo);




module.exports = router;