# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/).
Este projeto usa versionamento por *milestones* de jogo (não SemVer estrito).

## [v5.0.1] — 2026-06-28

### Corrigido
- **Dilemas e eventos socráticos travavam o jogo** — as opções não respondiam ao
  clique. Causa: a interpolação do índice no `onclick` estava escapada
  (`chooseDilemma(\${i})` / `chooseSocrates(\${i})`) dentro do template literal,
  renderizando `onclick="chooseDilemma(${i})"` literal — um SyntaxError ao clicar.
  Como o modal bloqueia a simulação e (no mobile) não há tecla Escape, o jogo ficava
  preso. Bug pré-existente (v4.x), exposto pela cadência curta da v5.0 (dilemas agora
  aparecem a cada poucos minutos). Também corrigido o `data-idx` escapado do quiz.
- Validado em navegador: opções de dilema e sócrates avançam e desabilitam
  corretamente, sem erros de JS.

## [v5.0] — 2026-06-26

Versão de conteúdo: foco no motor de questões (o principal eixo de progressão no prestígio 2+).

### Adicionado
- **Banco de questões ampliado: 55 → 91** (+36). Três categorias novas — **concorrência**,
  **redes** e **grafos** (6 cada) — além de ampliações em algoritmos, estruturas,
  complexidade, sistemas, genética e probabilidade. Cada questão mantém o formato
  (enunciado, 4 opções, explicação, reward/buff e penalty/debuff).
- **Anti-repetição de quiz**: uma janela das últimas questões servidas nunca repete,
  e a seleção favorece categorias menos vistas (peso inversamente proporcional à
  contagem por categoria), preservando o reforço de dificuldade (`hardEventChance`).
  Cumpre a promessa do manual ("o sistema não rastreia... ainda").
- Novas categorias adicionadas ao `catMap` da UID do quiz.

### Balanceamento — insight vira recurso escasso e o quiz vira o motor principal
Antes, o insight passivo gerava ~15/s no meio de jogo (acumulando >100 mil entre
eventos) enquanto um quiz dava +35 fixo a cada 90–120 min — a UI dizia "passivo é
escasso; quiz vale +35", o que era falso. Reformulação coordenada:

- **Passivo reduzido a um filete** (`INSIGHT_PER_BIRTH` 0.018→0.0006, `INSIGHT_DIV_FACTOR`
  0.005→0.0003, `INSIGHT_POP_FACTOR` 0.00006→0.0000008) — corte de ~25–30×.
- **O Laboratório agora amplia a recompensa do quiz, não o passivo.** Acaba o laço de
  fuga (insight passivo → mais lab → mais passivo); investir em lab passa a fortalecer
  o motor ativo (o quiz). Descrição do upgrade atualizada.
- **Recompensa do quiz escala com dificuldade e com o lab**: base +35 / +80 / +140
  (×directedMutation × labMul), no lugar de +35 fixo.
- **Cadência de eventos encurtada**: ~4–7 min (era 90–120 min), 2–4 min em cadeia,
  primeiro quiz aos 3 min (era 10). Piso de 2,5 min; erros encurtam até 2 min.
- Resultado modelado: o **quiz passa a ser 56–66% da renda de insight** em todas as
  fases (era <1%), com o passivo como trickle secundário. Texto do rodapé corrigido.

### Verificação
- Parsing estrutural do banco: 91 questões, 0 ids duplicados, todas com 4 opções,
  `cor` válido e reward/penalty presentes.
- Rebalance validado em navegador: cadência reagendada cai na janela de 2,5–7 min;
  quiz correto com lab 4 creditou a recompensa amplificada (base×1,4) pelo fluxo real,
  sem erros de JS; shares de insight modelados a partir das constantes do arquivo.
- Anti-repetição: 0 violações de repetição na janela em 300 sorteios; cobertura de
  88/91 questões e distribuição equilibrada entre categorias.
- Smoke test no Chromium: jogo carrega, `QUESTIONS.length=91`, quiz abre pelo fluxo
  real de evento com 4 alternativas, `recentQuizIds` registrando — sem erros de JS.

## [v4.7] — 2026-06-26

Versão de higiene técnica. Sem features novas de jogo — fundação para o que vem.

### Adicionado
- **Fonte única de versão** (`const VERSION`): alimenta `<title>` e header.
  Corrige a inconsistência de rótulo v3/v4/v4.6 (agora tudo lê `v4.7`).
- **Spatial grid** para a busca de vizinhos entre agentes. A consulta "amigo mais
  próximo" era O(população²) por ciclo; agora cada agente varre apenas as células
  da grade dentro do raio. Equivalência com a busca exaustiva validada em 5000
  casos aleatórios. Comida/veneno seguem lineares por design (raio de detecção
  longo torna o grid irrelevante e a consumação intra-ciclo exigiria grid vivo).
- **Versionamento de saves** (`schemaVersion` no `localStorage`) com migração
  segura: saves antigos (sem o campo) carregam como v1; saves de versão futura
  carregam em modo de compatibilidade.
- **Botão "Resetar save"** (com confirmação) nas Ferramentas de Deus, para zerar
  prestígio e depurar.

### Corrigido
- Explicação do quiz `a4` (loop O(N²)) atualizada: descrevia o spatial grid como
  pendente; agora reflete que ele existe a partir da v4.7.

## [v4.6] — 2026-06-26

Primeira versão versionada no repositório (upload inicial).

### Presente nesta versão
- Motor evolutivo baseado em agentes (grade 100×72, 6 genes contínuos, mutação na reprodução).
- Comida, veneno, rastros químicos e predadores opcionais.
- Economia idle com 3 recursos: biomassa, insight e entropia (parede mecânica em 3 faixas).
- Sistema de prestígio: Memória Evolutiva, 6 upgrades permanentes e biomas.
- Banco de 46 questões em 6 categorias; eventos `quiz`, `dilemma`, `socrates` e `epic`.
- Janela de calibração pós-quiz (desconto de 30% em upgrades de insight, prestígio 2+).
- Onboarding (splash + quiz tutorial + manual do motor).
- Persistência de prestígio via `localStorage`.

### Notas / dívidas técnicas conhecidas
- Inconsistência de rótulo de versão na UI: `<title>` diz "v3", o header diz "v4", o arquivo é "v4.6". A normalizar.
- Busca de vizinhos é O(n²) por ciclo (`nearest`/`nearestExcept`). *Spatial grid* marcado como pendente no código.
- Sem fonte única de verdade para a versão (string espalhada no markup).

[v5.0.1]: https://github.com/Drmcoelho/AgentIdle/releases/tag/v5.0.1
[v5.0]: https://github.com/Drmcoelho/AgentIdle/releases/tag/v5.0
[v4.7]: https://github.com/Drmcoelho/AgentIdle/releases/tag/v4.7
[v4.6]: https://github.com/Drmcoelho/AgentIdle/releases/tag/v4.6
