# MicroMundo Evolutivo

> Idle game de **computação viva**: agentes evoluem por seleção emergente, o ambiente muda sozinho e eventos de raciocínio (quizzes de computação) desafiam o jogador.

**Versão atual:** `v4.6` · arquivo único, sem build, sem dependências.

[▶ Jogar](index.html) — basta abrir o `index.html` em qualquer navegador moderno.

---

## O que é

MicroMundo Evolutivo é uma simulação baseada em agentes embrulhada em um *idle/incremental game*. Bolinhas verdes (agentes) carregam genes contínuos, percebem o ambiente local e agem sozinhas — ninguém dá ordens a elas. Quando se reproduzem, os filhos herdam genes parecidos com pequenas mutações. Genes que funcionam neste ambiente se espalham. Isso é **evolução emergente**, sem função de fitness explícita.

O papel do jogador não é controlar agentes, e sim **mudar as condições do mundo**: comprar upgrades, responder a eventos e decidir quando *ascender* (prestígio).

## Pilares de jogo

| Sistema | Descrição |
|---|---|
| **Motor evolutivo** | Grade 100×72. Cada agente tem 6 genes (curiosidade, cautela, sociabilidade, metabolismo, velocidade, memória). Mutação contínua na reprodução. Comida, veneno, rastros químicos e predadores opcionais. |
| **Economia idle** | 3 recursos de run: **biomassa** (upgrades imediatos), **insight** (upgrades avançados) e **entropia** (parede mecânica — penaliza superpopulação em 3 faixas: 70% / 90% / 100%). |
| **Prestígio** | Ao *ascender*, a run é apagada e vira **Memória Evolutiva** (ME) — a única moeda permanente. Compra upgrades que persistem e desbloqueia biomas. |
| **Eventos de raciocínio** | Banco de **46 questões** de computação em 6 categorias. Tipos de evento: `quiz`, `dilemma`, `socrates` e `epic` (raros, quase irreversíveis). Acertos dão buffs; no prestígio 2+ abrem janela de calibração (upgrades de insight 30% mais baratos). |
| **Onboarding** | Splash inicial, quiz tutorial e painel "Motor intuitivo" com manual integrado. |

### Categorias do banco de questões
`algoritmos` (11) · `estruturas` (8) · `complexidade` (7) · `genética` (7) · `probabilidade` (7) · `sistemas` (6)

## Como rodar

Nenhum build. É um único arquivo HTML com CSS e JS embutidos.

```bash
# opção 1: abrir direto
open index.html        # macOS
xdg-open index.html    # Linux

# opção 2: servidor local (recomendado para evitar restrições de file://)
python3 -m http.server 8000
# acesse http://localhost:8000
```

O progresso de prestígio é salvo no `localStorage` do navegador.

## Estrutura do repositório

```
.
├── index.html      # o jogo (versão jogável atual, v4.6)
├── README.md       # este arquivo
├── ROADMAP.md      # plano de versões futuras
└── CHANGELOG.md    # histórico de versões
```

Cada versão liberada recebe uma **git tag** (`v4.6`, `v5.0`, …). Veja [CHANGELOG.md](CHANGELOG.md) e [ROADMAP.md](ROADMAP.md).

## Stack

HTML + CSS + JavaScript puro (Canvas 2D). Zero dependências, zero build step. Português (PT-BR).
