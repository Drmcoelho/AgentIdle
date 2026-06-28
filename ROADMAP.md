# Roadmap — MicroMundo Evolutivo

Plano de evolução do projeto. As datas são indicativas; o escopo de cada versão pode
ser renegociado. Itens marcados com 🔧 são dívida técnica, 🎮 são jogabilidade,
📚 são conteúdo educativo, ✨ são novas features.

> **Princípio norteador:** o jogo ensina computação *sem* parecer um teste. Toda
> mudança deve preservar a sensação de "mundo vivo que reage às minhas decisões".

---

## v4.7 — Higiene e fundação (patch) ✅ concluída

Pequeno, sem features novas. Prepara o terreno para tudo que vem depois.

- [x] 🔧 **Fonte única de versão.** Um único `const VERSION = 'v4.7'` alimentando
  `<title>` e header. Corrige a inconsistência v3/v4/v4.6.
- [x] 🔧 **Spatial grid** para a busca de vizinhos entre agentes (era O(n²) por
  ciclo). Bucketização da grade 100×72; equivalência validada vs. busca exaustiva.
  Comida/veneno seguem lineares por design (raio longo + consumação intra-ciclo).
- [x] 🔧 **Versão dos saves.** `schemaVersion` no `localStorage` com migração segura.
- [x] 🔧 Botão de **reset de save** seguro (com confirmação) para depuração.

## v5.0 — Conteúdo do motor de questões (minor) ✅ concluída

Foco no principal eixo de progressão (quiz no prestígio 2+).

- [x] 📚 **Banco de questões 2×.** De 55 para **91** questões. Categorias novas:
  *concorrência*, *redes* e *grafos*. Formato mantido (stem, 4 opções, explicação,
  reward/penalty).
- [x] 📚 **Anti-repetição.** Janela de questões recentes sem repetição + viés para
  categorias menos vistas, preservando o reforço de dificuldade. Cumpre a promessa
  do manual ("o sistema não rastreia... ainda").

## v5.1 — Conteúdo de mundo (minor)

O restante do que era v5.0, agora em release próprio.

- 🎮 **Biomas jogáveis de fato.** Hoje `seedBank` cita "Ciclo Ártico" e "Parasitismo".
  Implementar modificadores reais de bioma (spawn de comida, entropia, predadores)
  e telegrafar o efeito na UI ao escolher na ascensão.
- 🎮 **Conquistas / marcos** (ex.: "10 linhagens coexistindo", "sobreviver a 100%
  de entropia") — leves, dão Memória Evolutiva extra.
- ✨ **Estatísticas de fim de run** na tela de ascensão (pop. máxima, diversidade
  pico, acertos por categoria) para fechar o loop de feedback.

## v5.x — Aprendizado adaptativo (a grande aposta educativa)

O manual diz: *"O sistema não rastreia suas categorias fracas de quiz — ainda."*
Esta linha é uma promessa. Aqui ela é cumprida.

- 📚 **Perfil de domínio por categoria.** Rastrear acerto/erro por categoria e
  ajustar a dificuldade e a frequência de questões para reforçar pontos fracos.
- 📚 **Curva de revisão (spaced repetition leve).** Questões erradas voltam mais
  cedo; questões dominadas espaçam.
- 🎮 Transformar o "que parece perseguição" (citado no manual) em mecânica honesta
  e legível, sem quebrar o tom narrativo.

## v6.0 — Refactor estrutural (major, opcional)

Só vale se o arquivo único começar a doer. Mantém o jogo 100% client-side.

- 🔧 **Modularização opcional** (ES modules: `engine.js`, `economy.js`, `events.js`,
  `ui.js`, `questions.js`) com um passo de bundle simples para gerar o
  `index.html` único — preservando a distribuição em arquivo único.
- 🔧 **Suite de testes** para a lógica pura (economia, mutação, entropia, custo de
  upgrade) — funções já são quase puras e testáveis.
- 🔧 **Determinismo opcional** (PRNG com seed) para reproduzir runs e testar.
- ✨ **PWA / offline**: manifest + service worker para instalar e jogar offline.

## Backlog / ideias soltas (sem versão)

- [x] 🎮 ~~**Cadência de eventos.**~~ Feito na v5.0: cadência reduzida para ~4–7 min,
  passivo virou trickle e o Laboratório passou a amplificar o quiz — o quiz agora é
  56–66% da renda de insight. (Acompanhar feedback: se modais frequentes incomodarem,
  considerar um modo "eventos só quando pausado" ou notificação não-bloqueante.)

- ✨ Exportar/importar save (string ou arquivo) para troca entre dispositivos.
- 🎮 Modo "observatório" sem upgrades, só para assistir a evolução.
- 🎮 Eventos sazonais / dilemas encadeados (arcos narrativos).
- 📚 Modo "explicação aprofundada" linkando cada questão a um conceito.
- ♿ Acessibilidade: navegação por teclado nos modais, contraste, `prefers-reduced-motion`.
- 🌐 Internacionalização (i18n) — hoje é PT-BR fixo.
- 📊 Telemetria local (sem servidor) de tempo de jogo e progressão.

---

## Processo de versionamento

1. Desenvolvimento em branch (`claude/...` ou `feature/...`).
2. Atualizar `VERSION`, `CHANGELOG.md` e este roadmap.
3. Merge na branch principal → criar **git tag** `vX.Y` → (opcional) GitHub Release.
4. Publicação via GitHub Pages a partir de `index.html` (quando habilitado).
