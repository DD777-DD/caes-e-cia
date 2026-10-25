# Cães & Cia — Unidade Caji

Landing page institucional de relacionamento, mobile-first, HTML/CSS/JavaScript sem dependências. A logo original foi preservada e as cópias WebP foram apenas redimensionadas e comprimidas.

## Publicação na Vercel

Importar este diretório como um novo projeto, sem substituir outros sites. Framework: Other. Build: `npm run build`. Output: `dist`. Não há dependências para instalar. Definir `SITE_URL` com o domínio público definitivo (por exemplo, a URL atribuída pela Vercel) e publicar. Sem `SITE_URL`, o build usa `VERCEL_PROJECT_PRODUCTION_URL` ou `VERCEL_URL`. O script atualiza canonical, Open Graph, dados estruturados, sitemap e robots. A publicação por CLI também é possível com `vercel --prod` após autenticação na conta correta.

## Conteúdo confirmado

Cães & Cia; unidade Caji; endereço e telefone fornecidos pelo responsável; banho e tosa; consultório aos sábados; produtos e acessórios; Ícaro como responsável pelo relacionamento. A outra unidade é mencionada apenas como Simões Filho. Instagram da unidade: https://www.instagram.com/caesecialaurodefreitas/ (a pesquisa pública do perfil/reels apresentou o telefone 98186-6867).

Não foram confirmados horários completos, fotos reais autorizadas, pin exato, domínio próprio e dados completos da outra unidade. Foram omitidos. Os links de mapa consultam o endereço informado; não usam place ID, coordenadas, avaliações ou dados do estabelecimento anterior. O elemento visual da localização é ilustrativo, sem representar um mapa geográfico.

## Mensuração e privacidade

Nenhum tracker é carregado com a configuração inicial. `dist/analytics-config.js` aceita IDs reais de GA4 e Meta Pixel. Após configurar, o aviso permite aceitar ou recusar; a escolha fica em localStorage e pode ser alterada no rodapé. Revogar recarrega a página sem reinicializar os scripts. Revisar aviso de privacidade e as configurações da hospedagem e dos provedores antes de ativar. Não há backend, captura de formulário ou integração com SimplesVet.

Eventos: `page_view`, `whatsapp_click`, `directions_click`, `service_interaction`, `service_view`. Eventos locais são expostos como `caes:interaction`, sem envio de rede enquanto não há configuração e consentimento. Clique no WhatsApp não é conversa iniciada: não há confirmação da mensagem nem callback de WhatsApp Business. UTMs reconhecidas permanecem em memória; origem e campanha, quando presentes, acompanham o rascunho visível no WhatsApp. Não são copiados gclid, fbclid ou valores arbitrários.

A instalação de um Pixel pode criar cookies; revogar impede novas inicializações e novos eventos, mas não apaga cookies que já foram criados no domínio de terceiros. A exclusão de dados deve ser tratada também com os provedores quando aplicável.

## Verificação

`npm run check` valida a sintaxe. A estrutura sem build facilita migração e manutenção. Os testes de navegador e os resultados da execução ficam no relatório entregue com o projeto.
