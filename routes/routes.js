const express = require('express');

const router = express.Router();



const UsuariosController = require('../src/controllers/Usuario');

router.get('/usuarios', UsuariosController.listarUsuarios);

router.post('/usuarios', UsuariosController.cadastrarUsuario);

router.patch('/usuarios', UsuariosController.editarUsuario);

router.delete('/usuarios', UsuariosController.apagarUsuario);


const FavoritosSalvosController = require('../src/controllers/favoritos');

router.get('/favoritossalvos', FavoritosSalvosController.listarFavoritosSalvos);

router.post('/favoritossalvos', FavoritosSalvosController.cadastrarFavoritosSalvos);

router.patch('/favoritossalvos', FavoritosSalvosController.editarFavoritosSalvos);

router.delete('/favoritossalvos', FavoritosSalvosController.apagarFavoritosSalvos);



const capitulosController = require('../src/controllers/capitulos');

router.get('/capitulos', capitulosController.listarCapitulos);

router.post('/capitulos', capitulosController.cadastrarCapitulos);

router.put('/capitulos/:id', capitulosController.editarCapitulos);

router.delete('/capitulos/:id', capitulosController.apagarCapitulos);



const usuarioMissaoController = require('../src/controllers/usuario_missao');

router.get('/usuario-missoes', usuarioMissaoController.listarUsuarioMissoes);

router.post('/usuario-missoes', usuarioMissaoController.cadastrarUsuarioMissao);

router.put('/usuario-missoes', usuarioMissaoController.editarUsuarioMissao);

router.delete('/usuario-missoes', usuarioMissaoController.apagarUsuarioMissao);



const obrasController = require('../src/controllers/obra');

router.get('/obras', obrasController.listarObras);

router.post('/obras', obrasController.cadastrarObra);

router.put('/obras/:id', obrasController.editarObra);

router.delete('/obras/:id', obrasController.apagarObra);



const missoesController = require('../src/controllers/missoes');

router.get('/missoes', missoesController.listarMissoes);

router.post('/missoes', missoesController.cadastrarMissao);

router.put('/missoes', missoesController.editarMissao);

router.delete('/missoes', missoesController.apagarMissao);



const comentariosController = require('../src/controllers/comentario_obra');

router.get('/comentarios', comentariosController.listarComentarios);

router.post('/comentarios', comentariosController.cadastrarComentario);

router.put('/comentarios/:id', comentariosController.editarComentario);

router.delete('/comentarios/:id', comentariosController.apagarComentario);



const chatController = require('../src/controllers/chat');

router.get('/chat', chatController.listarChat);

router.post('/chat', chatController.cadastrarChat);

router.put('/chat/:Chat_ID', chatController.editarChat);

router.delete('/chat/:Chat_ID', chatController.apagarChat);



const seguindoController = require('../src/controllers/seguindo');

router.get('/seguindo', seguindoController.listarSeguindo);

router.post('/seguindo', seguindoController.cadastrarSeguindo);

router.put('/seguindo/:Us_ID', seguindoController.editarSeguindo);

router.delete('/seguindo/:Us_ID', seguindoController.apagarSeguindo);




module.exports = router;