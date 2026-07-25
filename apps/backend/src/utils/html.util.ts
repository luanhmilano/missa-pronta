import type { PopulatedMissa } from './missa.util.js';
import { buildMassViewModel, formatLyricsText } from './missa.util.js';

export function renderMassHtml(mass: PopulatedMissa): string {
  const viewModel = buildMassViewModel(mass);
  const sectionsHtml = viewModel.sections
    .map((section) => {
      const label = section.label.replace(/_/g, ' ').toUpperCase();
      let songContent = `<p class="empty">Música não selecionada.</p>`;

      if (section.song) {
        const title = section.song.titulo;
        const tone = section.song.tom || 'não informado';
        const lyricsFormatted = formatLyricsText(section.song.letra);
        const lyrics = lyricsFormatted
          ? `<pre class="lyrics">${lyricsFormatted}</pre>`
          : `<p class="empty">Sem letra cadastrada.</p>`;

        songContent = `
          <p class="song-title">${title}</p>
          <p class="song-tone">Tom: ${tone}</p>
          ${lyrics}
        `;
      }

      return `
        <article class="card">
          <h2>${label}</h2>
          ${songContent}
        </article>
      `;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Missa - ${mass.nome}</title>
  <style>
    :root { color-scheme: light; --bg: #f6f2ea; --surface: #ffffff; --text: #1f2937; --muted: #6b7280; --border: #e5dccf; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: linear-gradient(180deg, #faf7f2 0%, var(--bg) 100%); color: var(--text); line-height: 1.5; }
    .top-bar { height: 25px; background: linear-gradient(90deg, #0044cc 50%, #c00000 50%); }
    .page { max-width: 960px; margin: 0 auto; padding: 24px 20px 48px; }
    .hero { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 28px; box-shadow: 0 18px 42px rgba(31, 41, 55, 0.08); margin-bottom: 24px; text-align: center; }
    .institution { font-size: 14px; font-weight: 700; color: #000000; margin-bottom: 2px; }
    h1 { margin-top: 16px; margin-bottom: 4px; font-size: 26px; color: #000000; }
    .event-date { font-size: 15px; font-style: italic; color: #1f2937; margin-bottom: 8px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 20px; }
    .card h2 { font-size: 18px; margin-bottom: 10px; color: #c00000; text-transform: uppercase; text-decoration: underline; text-underline-offset: 4px; }
    .song-title { font-weight: 700; font-size: 17px; margin-bottom: 4px; color: #0044cc; }
    .song-tone { color: #c00000; font-weight: 700; font-style: italic; margin-bottom: 12px; }
    .lyrics { white-space: pre-wrap; margin: 0; padding: 14px; background: #fbf8f4; border-radius: 14px; border: 1px solid #efe5d7; font-family: inherit; font-size: 15px; font-weight: 600; line-height: 1.5; color: #000000; }
    .empty { color: var(--muted); font-style: italic; margin: 0; }
  </style>
</head>
<body>
  <div class="top-bar"></div>
  <main class="page">
    <header class="hero">
      <div class="institution">Arquidiocese Metropolitana de Belém</div>
      <div class="institution">Basílica Santuário de Nossa Senhora de Nazaré do Desterro</div>
      <div class="institution">Juventude Nazarena</div>
      <div class="institution">Movimento Sementes da Misericórdia</div>
      <h1>${mass.nome}</h1>
      <div class="event-date">${viewModel.formattedDate}</div>
    </header>
    <section class="grid">
      ${sectionsHtml}
    </section>
  </main>
</body>
</html>`;
}
