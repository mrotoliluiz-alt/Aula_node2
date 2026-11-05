const express = require('express');

const router = express.Router();

const uploadImagem = require('../../middleware/uploadHelper');

const uploadUsuarios = uploadImagem('usuarios');
const uploadObras = uploadImagem('obras');



const UsuariosController = require('../controllers/Usuario');

router.get('/usuarios', UsuariosController.listarUsuarios);

router.post('/usuarios', uploadUsuarios.single('img'), UsuariosController.cadastrarUsuario);

router.put('/usuarios/:id', uploadUsuarios.single('img'), UsuariosController.editarUsuario);

router.delete('/usuarios/:id', UsuariosController.apagarUsuario);

router.get('/login', UsuariosController.login); // query


const FavoritosSalvosController = require('../controllers/favoritos');

router.get('/favoritossalvos', FavoritosSalvosController.listarFavoritosSalvos);

router.post('/favoritossalvos', FavoritosSalvosController.cadastrarFavoritosSalvos);

router.put('/favoritossalvos/:id', FavoritosSalvosController.editarFavoritosSalvos);

router.delete('/favoritossalvos/:id', FavoritosSalvosController.apagarFavoritosSalvos);

router.get('/favoritos/detalhados', FavoritosSalvosController.listarFavoritosDetalhados);

router.get('/favoritos/usuario/:id', FavoritosSalvosController.listarFavoritosUsuario);

router.get('/favoritos/obra/:id/usuarios', FavoritosSalvosController.listarUsuariosFavoritaramObra);

router.get('/favoritos/status/:status', FavoritosSalvosController.listarFavoritosStatus);



const capitulosController = require('../controllers/capitulos');

router.get('/capitulos', capitulosController.listarCapitulos);

router.post('/capitulos', capitulosController.cadastrarCapitulos);

router.put('/capitulos/:id', capitulosController.editarCapitulos);

router.delete('/capitulos/:id', capitulosController.apagarCapitulos);

router.get('/capitulos/obra/:id', capitulosController.listarCapitulosObra);

router.get('/capitulos/quantidade', capitulosController.listarQntCapitulo);



const usuarioMissaoController = require('../controllers/usuario_missao');

router.get('/usuario-missoes', usuarioMissaoController.listarUsuarioMissoes);

router.post('/usuario-missoes', usuarioMissaoController.cadastrarUsuarioMissao);

router.put('/usuario-missoes/:id', usuarioMissaoController.editarUsuarioMissao);

router.delete('/usuario-missoes/:id', usuarioMissaoController.apagarUsuarioMissao);

router.get('/usuario-missoes/detalhado', usuarioMissaoController.listarUsuarioMissoesDetalhado);

router.get('/usuario-missoes/usuario/:id', usuarioMissaoController.listarMissoesUsuario);

router.get('/usuario-missoes/missao/:id', usuarioMissaoController.listarUsuariosMissao);

router.get('/usuario-missoes/quantidade', usuarioMissaoController.listarQuantidadeMissoesUsuario);






const obrasController = require('../controllers/obra');

router.get('/obras', obrasController.listarObras);

router.post('/obras', uploadObras.single('img'), obrasController.cadastrarObra);

router.put('/obras/:id', uploadObras.single('img'), obrasController.editarObra);

router.delete('/obras/:id', obrasController.apagarObra);

router.get('/genero', obrasController.listarGeneros);

router.get('/capitulos_obra', obrasController.listarQntCapitulo);

router.get('/obras/detalhada/:id', obrasController.listarObraDetalhada);

router.get('/obras/usuario/:id', obrasController.listarObrasUsuario);

router.get('/obras/favoritas', obrasController.listarObrasFavoritas);

router.get('/obras/mais-comentadas', obrasController.listarObrasMaisComentadas);




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

router.get('/comentarios/detalhados', comentariosController.listarComentariosDetalhados);

router.get('/comentarios/obra/:id', comentariosController.listarComentariosObra);

router.get('/comentarios/usuario/:id', comentariosController.listarComentariosUsuario);

router.get('/comentarios/moderacao/:moderacao', comentariosController.listarComentariosModeracao);



const chatController = require('../controllers/chat');

router.get('/chat', chatController.listarChat);

router.post('/chat', chatController.cadastrarChat);

router.put('/chat/:Chat_ID', chatController.editarChat);

router.delete('/chat/:Chat_ID', chatController.apagarChat);

router.get('/chat/usuarios', chatController.listarChatUsuarios);

router.get('/chat/conversa/:id', chatController.listarConversa);

router.get('/chat/enviadas/:id', chatController.listarMensagensEnviadas);

router.get('/chat/recebidas/:id', chatController.listarMensagensRecebidas);



const seguindoController = require('../controllers/seguindo');

router.get('/seguindo', seguindoController.listarSeguindo);

router.post('/seguindo', seguindoController.cadastrarSeguindo);

router.put('/seguindo/:Us_ID', seguindoController.editarSeguindo);

router.delete('/seguindo/:id/:seguindo', seguindoController.apagarSeguindo);

router.get('/seguindo/detalhado/:id', seguindoController.listarSeguindoDetalhado);

router.get('/seguindo/seguidores/:id', seguindoController.listarSeguidores);

router.get('/seguindo/quantidade', seguindoController.listarQuantidadeSeguindo);

router.get('/seguindo/quantidade-seguidores', seguindoController.listarQuantidadeSeguidores);





module.exports = router;