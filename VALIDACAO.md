# Validação — Cães & Cia, Caji

Data: 25/10/2026.

- Sintaxe JavaScript: aprovada (`npm run check`).
- Testes de mensuração e consentimento: aprovados (`node tests/analytics.cjs`). IDs vazios ou inválidos não carregam trackers; IDs válidos exigem consentimento; recusa bloqueia carregamento; aceite carrega os provedores configurados. Os testes usam um DOM simulado, sem tráfego para GA4/Meta.
- URLs do WhatsApp: número 5571981866867 e mensagens em português com codificação validada. As UTMs de origem e campanha aparecem no rascunho da mensagem. Não houve envio de mensagem nem validação da disponibilidade da conta comercial.
- Rotas: consultas ao endereço com número 4197, Caji e Lauro de Freitas; sem coordenadas ou ficha do antigo negócio.
- SEO: um H1; idioma pt-BR; title; description; canonical; Open Graph; dados estruturados PetStore; robots.txt; sitemap XML válido.
- Arquivos referenciados no HTML: encontrados. Imagens renderizadas e verificadas no navegador. Logo principal WebP: 81.208 bytes.
- Navegação: âncoras de serviços e localização verificadas no navegador. Aviso de privacidade expansível funcional.
- Desktop: inspeção visual no Chrome em janela de aproximadamente 1.360 px.
- Celular e tablet: layout exercitado em iframes de 320, 390 e 768 px. Área útil (excluindo scrollbar) de 305, 375 e 753 px; scrollWidth igual a clientWidth em todas após correções. Sem rolagem horizontal.
- Acessibilidade implementada: nomes de links e imagens, ícones decorativos ocultos da árvore de acessibilidade, foco visível, link para pular conteúdo, botões sem dependência de hover, respeito a prefers-reduced-motion.
- Console: nenhum erro atribuído ao código da aplicação durante a inspeção. A extensão do ambiente registrou mensagens próprias que não pertencem à aplicação.

## Limites da verificação

Não foi realizado teste em iPhone/Android físico, auditoria completa de acessibilidade nem medição Lighthouse/Core Web Vitals. Não há garantia de posição no Google. A busca de endereço não equivale a confirmar o pin exato. Analytics/Pixel permanecem desativados; não houve validação de recebimento em contas reais.

## Publicação

Projeto preparado para Vercel. Não há autenticação da Vercel disponível na execução; nenhuma publicação nessa conta foi realizada. A versão hospedada por Sites começa como prévia de acesso restrito ao proprietário. Ela não deve ser usada em campanhas até haver uma URL de acesso público aprovada. Endereço, horários e serviços podem ser mantidos no HTML; ao mudar o domínio, usar SITE_URL no build para atualizar SEO.
