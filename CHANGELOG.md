# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/).
Este projeto usa versionamento por *milestones* de jogo (não SemVer estrito).

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

[v4.6]: https://github.com/Drmcoelho/AgentIdle/releases/tag/v4.6
