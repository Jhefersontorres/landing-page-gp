# Landing Page GP

Página pública do Grand Prix 2026, separada do sistema de avaliação. Exibe
informações do evento, contagem regressiva e o ranking somente depois da
liberação feita pela administração.

## Publicação

Projeto estático, sem dependências de build. Importe este repositório na Vercel
e mantenha a raiz do projeto no diretório do repositório. O endereço da API é
configurado em `config.js`; nenhum segredo ou credencial do banco deve ser
colocado nesta aplicação pública.

## API utilizada

- `GET /divulgacao` para consultar o estado e a data de publicação.
- `GET /ranking` para mostrar resultados quando a API autorizar a divulgação.

O ranking depende da configuração CORS do backend e permanece oculto enquanto
os resultados estiverem fechados.
