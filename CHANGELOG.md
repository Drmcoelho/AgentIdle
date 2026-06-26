# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/).
Este projeto usa versionamento por *milestones* de jogo (não SemVer estrito).

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

[v4.7]: https://github.com/Drmcoelho/AgentIdle/releases/tag/v4.7
[v4.6]: https://github.com/Drmcoelho/AgentIdle/releases/tag/v4.6
