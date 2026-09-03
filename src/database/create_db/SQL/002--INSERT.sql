INSERT INTO USUARIO
(Us_nome, Us_email, Us_senha, Us_biografia, Us_SV, Us_nivel, Us_XP_total, Us_dt_ultimo_acesso, Us_adm, Us_imagem)
VALUES
('Ana Silva',
 'ana@readduo.com',
 'senha_teste_123',
 'Apaixonada por literatura e fantasia.',
 TRUE,
 8,
 2450,
 '2026-08-28',
 FALSE,
 'ana.png'),

('Lucas Oliveira',
 'lucas@readduo.com',
 'senha_teste_456',
 'Leitor de ficção científica e aventura.',
 TRUE,
 12,
 5870,
 '2026-08-27',
 FALSE,
 'lucas.png'),

('Mariana Santos',
 'mariana@readduo.com',
 'senha_teste_789',
 'Gosto de escrever histórias e compartilhar ideias.',
 FALSE,
 6,
 1780,
 '2026-08-28',
 FALSE,
 'mariana.png'),

('Pedro Costa',
 'pedro@readduo.com',
 'senha_teste_321',
 'Sempre procurando uma nova história para ler.',
 FALSE,
 4,
 920,
 '2026-08-26',
 FALSE,
 'pedro.png'),

('Julia Almeida',
 'julia@readduo.com',
 'senha_teste_654',
 'Leitora de romances e histórias contemporâneas.',
 TRUE,
 10,
 4120,
 '2026-08-28',
 FALSE,
 'julia.png'),

('Gabriel Souza',
 'gabriel@readduo.com',
 'senha_teste_987',
 'Escritor iniciante e leitor nas horas vagas.',
 FALSE,
 7,
 2150,
 '2026-08-25',
 FALSE,
 'gabriel.png'),

('Beatriz Lima',
 'beatriz@readduo.com',
 'senha_teste_111',
 'Fã de mistério, suspense e investigação.',
 TRUE,
 15,
 7320,
 '2026-08-28',
 FALSE,
 'beatriz.png'),

('Rafael Martins',
 'rafael@readduo.com',
 'senha_teste_222',
 'Meu objetivo é ler todos os dias.',
 FALSE,
 3,
 640,
 '2026-08-24',
 FALSE,
 'rafael.png'),

('Camila Rocha',
 'camila@readduo.com',
 'senha_teste_333',
 'Escrevo contos e gosto de conhecer novos autores.',
 FALSE,
 9,
 3260,
 '2026-08-28',
 FALSE,
 'camila.png'),

('Administrador',
 'admin@readduo.com',
 'senha_admin_teste',
 'Conta administrativa do sistema.',
 TRUE,
 20,
 10000,
 '2026-08-28',
 TRUE,
 'admin.png');


INSERT INTO OBRA
(Us_ID, Ob_titulo, Ob_sinopse, Ob_genero, Ob_status, Ob_imagem)
VALUES

(1,
 'O Último Capítulo',
 'Uma jovem encontra um livro misterioso capaz de alterar acontecimentos do mundo real.',
 'Fantasia',
 1,
 'ultimo_capitulo.jpg'),

(2,
 'Além das Estrelas',
 'Um grupo de estudantes embarca em uma jornada para descobrir os segredos de uma civilização distante.',
 'Ficção Científica',
 1,
 'alem_estrelas.jpg'),

(3,
 'Cartas para o Amanhã',
 'Uma coleção de cartas revela histórias sobre amizade, escolhas e amadurecimento.',
 'Romance',
 2,
 'cartas_amanha.jpg'),

(4,
 'O Mistério da Biblioteca',
 'Livros desaparecem misteriosamente de uma biblioteca e um grupo de jovens decide investigar.',
 'Mistério',
 1,
 'misterio_biblioteca.jpg'),

(6,
 'Entre Linhas',
 'Um jovem escritor tenta encontrar sua própria voz enquanto enfrenta seus primeiros desafios.',
 'Drama',
 2,
 'entre_linhas.jpg'),

(9,
 'A Cidade Esquecida',
 'Uma cidade que não aparece em nenhum mapa guarda um segredo que pode mudar a vida de seus visitantes.',
 'Aventura',
 1,
 'cidade_esquecida.jpg');
 
 INSERT INTO CAPITULO
(Ob_ID, Cap_ordem, Cap_titulo, Cap_conteudo)
VALUES

(1, 1,
 'O Livro',
 'Luna encontrou um livro antigo escondido no fundo da biblioteca.'),

(1, 2,
 'A Primeira Página',
 'Ao abrir o livro, Luna percebeu que as palavras estavam mudando diante de seus olhos.'),

(1, 3,
 'O Aviso',
 'Uma mensagem misteriosa apareceu no final da página.'),


(2, 1,
 'A Descoberta',
 'Os estudantes encontraram uma transmissão desconhecida durante uma atividade escolar.'),

(2, 2,
 'Além das Estrelas',
 'A transmissão indicava a localização de um planeta desconhecido.'),

(2, 3,
 'A Jornada',
 'O grupo decidiu investigar a origem da transmissão.'),


(3, 1,
 'Primeira Carta',
 'A primeira carta falava sobre uma amizade que havia começado muitos anos antes.'),

(3, 2,
 'Segunda Carta',
 'A segunda carta revelava um segredo guardado durante décadas.'),


(4, 1,
 'O Livro Desaparecido',
 'Um livro raro desapareceu da biblioteca durante a madrugada.'),

(4, 2,
 'As Pistas',
 'Os investigadores encontraram três pistas escondidas entre as estantes.'),

(4, 3,
 'O Suspeito',
 'Uma nova informação mudou completamente o rumo da investigação.'),


(5, 1,
 'Primeiras Palavras',
 'Gabriel começou a escrever sua primeira história.'),

(5, 2,
 'O Bloqueio',
 'O escritor percebeu que continuar a história seria mais difícil do que imaginava.'),


(6, 1,
 'A Cidade',
 'Camila chegou a uma cidade que não aparecia em nenhum mapa.'),

(6, 2,
 'O Segredo',
 'Os moradores pareciam esconder alguma coisa.'),

(6, 3,
 'A Verdade',
 'Depois de investigar durante toda a noite, Camila descobriu a verdade.');
 
 
 INSERT INTO MISSOES
(Ms_titulo, Ms_descricoo, Ms_recompensaXP, Ms_Tipo)
VALUES

('Primeira Leitura',
 'Leia seu primeiro capítulo.',
 50,
 'Leitura'),

('Leitor Iniciante',
 'Leia 3 capítulos.',
 100,
 'Leitura'),

('Leitor Dedicado',
 'Leia 5 capítulos.',
 200,
 'Leitura'),

('Leitor Incansável',
 'Leia durante 7 dias consecutivos.',
 500,
 'Ofensiva'),

('Primeira Obra',
 'Publique sua primeira obra.',
 150,
 'Escrita'),

('Primeiro Capítulo',
 'Escreva e publique seu primeiro capítulo.',
 100,
 'Escrita'),

('Comentarista',
 'Faça seu primeiro comentário em uma obra.',
 50,
 'Social'),

('Conhecendo a Comunidade',
 'Siga 5 usuários.',
 100,
 'Social'),

('Semana de Leitura',
 'Mantenha uma sequência de leitura durante 7 dias.',
 300,
 'Ofensiva'),

('Mestre da Leitura',
 'Leia 20 capítulos.',
 1000,
 'Leitura');
 
 
 INSERT INTO USUARIO_MISSAO
(Us_ID, Ms_ID, Um_Status, Um_Dtconclução)
VALUES

(1, 1, 'Concluida', '2026-08-20'),
(1, 2, 'Concluida', '2026-08-22'),
(1, 3, 'Em andamento', NULL),

(2, 1, 'Concluida', '2026-08-15'),
(2, 2, 'Concluida', '2026-08-17'),
(2, 3, 'Concluida', '2026-08-20'),
(2, 4, 'Concluida', '2026-08-25'),

(3, 1, 'Concluida', '2026-08-24'),
(3, 5, 'Concluida', '2026-08-26'),
(3, 6, 'Em andamento', NULL),

(4, 1, 'Em andamento', NULL),

(5, 1, 'Concluida', '2026-08-21'),
(5, 7, 'Concluida', '2026-08-23'),

(6, 5, 'Concluida', '2026-08-24'),
(6, 6, 'Concluida', '2026-08-25'),

(7, 1, 'Concluida', '2026-08-18'),
(7, 2, 'Concluida', '2026-08-20'),
(7, 3, 'Concluida', '2026-08-23'),
(7, 10, 'Em andamento', NULL),

(8, 1, 'Em andamento', NULL),

(9, 5, 'Concluida', '2026-08-22'),
(9, 7, 'Concluida', '2026-08-25');

INSERT INTO FAVORITOS_SALVOS
(Ob_ID, Us_ID, Fav_status, Ob_PagAtual)
VALUES

(1, 2, 'Favorito', 15),
(1, 5, 'Lendo', 28),
(2, 1, 'Favorito', 10),
(2, 7, 'Lendo', 35),
(3, 4, 'Favorito', 5),
(3, 5, 'Lendo', 18),
(4, 1, 'Lendo', 42),
(4, 7, 'Favorito', 20),
(5, 3, 'Lendo', 12),
(5, 9, 'Favorito', 30),
(6, 2, 'Lendo', 25),
(6, 6, 'Favorito', 8);

INSERT INTO SEGUINDO
(Us_ID, Seguindo)
VALUES

(1, 2),
(1, 3),
(1, 5),

(2, 1),
(2, 7),
(2, 9),

(3, 1),
(3, 6),
(3, 9),

(4, 1),
(4, 2),

(5, 1),
(5, 3),
(5, 7),

(6, 3),
(6, 9),

(7, 1),
(7, 2),
(7, 5),

(8, 1),
(8, 4),

(9, 3),
(9, 6);

INSERT INTO CHAT_USUARIO
(Chat_remetente, Chat_destinatario, Chat_data_hora, Chat_mensagem, Chat_status)
VALUES

(1, 2, '2026-08-28 09:15:00',
 'Oi! Você já terminou Além das Estrelas?',
 1),

(2, 1, '2026-08-28 09:18:00',
 'Ainda não, estou no terceiro capítulo.',
 1),

(1, 2, '2026-08-28 09:20:00',
 'Estou gostando bastante da história!',
 1),

(3, 6, '2026-08-27 14:30:00',
 'Você já publicou seu novo capítulo?',
 1),

(6, 3, '2026-08-27 14:35:00',
 'Ainda não, estou revisando o texto.',
 1),

(5, 1, '2026-08-28 10:00:00',
 'Gostei muito da sua obra!',
 1),

(7, 5, '2026-08-28 11:25:00',
 'Você recomenda algum livro de mistério?',
 0);
 
 INSERT INTO COMENTARIO_OBRA
(Us_ID, Ob_ID, Com_obr_Dtenvio, Com_obr_texto, Com_obr_moderacao)
VALUES

(2, 1,
 '2026-08-28 09:30:00',
 'A história ficou muito interessante a partir do segundo capítulo!',
 'Aprovado'),

(5, 1,
 '2026-08-28 10:15:00',
 'Gostei bastante da protagonista.',
 'Aprovado'),

(1, 2,
 '2026-08-27 16:20:00',
 'A ideia da história é muito criativa.',
 'Aprovado'),

(7, 2,
 '2026-08-27 18:10:00',
 'O segundo capítulo me deixou curiosa para continuar.',
 'Aprovado'),

(4, 3,
 '2026-08-26 15:40:00',
 'A escrita é simples e agradável.',
 'Aprovado'),

(9, 4,
 '2026-08-28 08:50:00',
 'Adorei tentar descobrir quem era o responsável pelo desaparecimento.',
 'Aprovado'),

(1, 4,
 '2026-08-28 09:10:00',
 'As pistas foram muito bem colocadas.',
 'Aprovado'),

(5, 5,
 '2026-08-27 12:00:00',
 'Gostei muito da evolução do personagem.',
 'Aprovado'),

(3, 6,
 '2026-08-28 13:00:00',
 'Quero muito descobrir o segredo da cidade!',
 'Em análise');
