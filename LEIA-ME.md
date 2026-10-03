# Site da CHG Elétrica

Site com três páginas (Início, Serviços e Empresa), pronto a publicar em qualquer alojamento (cPanel, Netlify, GitHub Pages, Hostinger, etc.).

## Como publicar
1. Envie os ficheiros `index.html`, `servicos.html`, `empresa.html` e a pasta `assets` para a pasta pública do alojamento (normalmente `public_html`).
2. Abra o domínio no navegador. Não precisa de base de dados nem de servidor.

## O que funciona
- Menu com ligação a cada secção e menu móvel no telemóvel.
- Projecto 01 com separadores Planta e Vista 3D e imagem ampliada ao tocar.
- Formulário de orçamento com validação. Ao enviar, abre o WhatsApp com a mensagem já escrita para +258 85 277 6220.
- Botões para copiar os números e abrir o WhatsApp de cada número.
- Botão de WhatsApp fixo no canto do ecrã.
- O formulário guarda um rascunho no navegador da pessoa, para não perder o que escreveu.

## Páginas
- `index.html`: página inicial com resumo de tudo e formulário de orçamento.
- `servicos.html`: Instalação eléctrica, Manutenção eléctrica, Projectos eléctricos, Plano de manutenção e Formação técnica.
- `empresa.html`: Sobre nós, Para quem trabalhamos, Projectos, Como trabalhamos e Porquê a CHG.
- Estilos em `assets/site.css` e funcionamento em `assets/site.js`, partilhados pelas três páginas.

## Como alterar
- Número do WhatsApp do formulário: em `assets/site.js`, procure `WA_NUMBER` e troque `258852776220`.
- Imagens: substitua os ficheiros em `assets` mantendo o mesmo nome.
- Novos projectos: copie o bloco `<section ... id="projectos">` e troque textos e imagens.
