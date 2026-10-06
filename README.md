# Conhecendo Tijucas · BI

Painel de inteligência comercial para campanhas, atendimento, vendas e comissões. Interface em português, com filtros e previsão de recebíveis.

## Execução local

Requer Node.js 22 ou superior. Disponibilize as bases autorizadas `data.json` e `finance-data.json` na pasta local `private/` e execute:

```sh
npm run build
npm start
```

Abra `http://127.0.0.1:4174/#financeiro`. Use `npm run check` para verificar sintaxe e arquivos rastreados.

## Dados e publicação

As bases são cópias locais importadas do Google Sheets, com atualização manual. O painel não grava nem exclui dados nas planilhas. Bases, credenciais, exports e capturas ficam fora do Git; `.env.example` contém apenas nomes de configuração.

A hospedagem deve exigir login e autorização em todas as rotas, inclusive nos arquivos JSON. Nunca publique `dist/` em hospedagem anônima. O repositório contém o código; o pacote de publicação privado inclui as bases autorizadas.
