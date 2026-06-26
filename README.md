# ⚙️ Agent Idle

Um **idle / incremental game** sobre montar uma frota de agentes de IA que geram
*compute* automaticamente — enquanto você joga e enquanto está fora.

100% client-side: HTML, CSS e JavaScript puro, sem build, sem dependências.
Abra o `index.html` no navegador e pronto.

## ▶️ Como jogar

1. Clique no **Núcleo de Compute** para gerar compute manualmente.
2. Compre **Agentes** (estagiários, bots, enxames, datacenters, AGI…) — cada um
   produz compute por segundo, para sempre.
3. Compre **Upgrades** para multiplicar cliques e produção global.
4. Quando acumular bastante, **Treine um Modelo** (prestígio): você reinicia o
   progresso e ganha **insights** permanentes, cada um dando +2% de produção
   global. É assim que você quebra os tetos seguintes.

O jogo **salva sozinho** no `localStorage` a cada 15s e ao fechar a aba, e
calcula **progresso offline** (até 8h) quando você volta.

## 🚀 Rodar localmente

Como é tudo estático, basta abrir o arquivo:

```bash
# qualquer servidor estático serve; por exemplo:
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

Ou simplesmente dê um duplo-clique no `index.html`.

## 🌐 Publicar no GitHub Pages

1. Faça push deste repositório.
2. Em **Settings → Pages**, selecione a branch e a pasta `/ (root)`.
3. O jogo fica disponível em `https://<usuário>.github.io/<repo>/`.

## 🗂️ Estrutura

```
index.html   — marcação e layout
style.css    — tema escuro, animações
game.js      — engine: geradores, upgrades, prestígio, save/load, loop
```

## ⚖️ Balanceamento

- Custo dos geradores cresce ~15–22% por unidade comprada.
- Produção e cliques são multiplicados por upgrades e pelo bônus de insights.
- Prestígio rende `floor(sqrt(totalGanho / 1e6))` insights — exige acumular para valer a pena.

Sinta-se livre para ajustar os números em `GENERATORS` e `UPGRADES` no topo do
`game.js`.

---

Feito com ⚙️ por agentes ociosos.
