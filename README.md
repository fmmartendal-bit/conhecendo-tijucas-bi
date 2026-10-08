# Conhecendo Tijucas · BI

Painel de campanhas, atendimento, vendas e comissões. Versão integrada ao GitHub em 08/10/2026, com as bases da última prévia local. A integração não atualiza automaticamente as planilhas.

## Execução

Requer Node.js 22 ou superior. Sem dependências externas:

```sh
npm run check
npm run build
npm start
```

Prévia: http://127.0.0.1:4174/#financeiro

## Estrutura

- `src/`: interface e gráficos.
- `published-data/`: cópias das bases autorizadas por Felipe para integrar esta versão.
- `scripts/`: verificação, montagem e prévia.
- `dist/`: resultado gerado, ignorado no Git.

As bases incluem informações reais de clientes e comissões. Após publicar no GitHub Pages, os arquivos JSON estarão disponíveis junto com o site. `robots.txt` solicita que buscadores não indexem, mas não controla acesso. Não há login implementado.

## Publicação pelo GitHub Pages

1. Em Settings → Pages, escolher GitHub Actions como fonte. Repositórios privados precisam de um plano que permita Pages; não é necessário alterar a visibilidade do repositório.
2. Em Actions → Verificar e publicar BI, executar Run workflow na branch main.
3. Aguardar os trabalhos build e deploy concluírem.
4. Conferir a URL retornada pelo deploy. Endereço esperado: https://fmmartendal-bit.github.io/conhecendo-tijucas-bi/

Um push verifica o código e a montagem; a publicação exige execução manual do workflow. O ambiente github-pages pode ter aprovação configurada no GitHub.

## Atualizações dos dados

Atualizar `published-data/data.json` e `published-data/finance-data.json` a partir das planilhas e registrar a data real de importação no painel. Rodar as verificações antes de publicar novamente. Datas de vencimento são manuais; a integração não modifica essas regras.
