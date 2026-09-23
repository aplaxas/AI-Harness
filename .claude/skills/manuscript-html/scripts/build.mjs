#!/usr/bin/env node
// 원고 마크다운 → 책 디자인 HTML. 외부 패키지 없이 Node 18+에서 돈다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(HERE, '..', 'assets', 'template.html');
const SECTION_FILE = /^(\d{2})-(\d{2})-.+\.md$/;
const LIST = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const MIME = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp' };
const CALLOUTS = { NOTE: 'note', TIP: 'tip', '궁금해요': 'ask', '주의': 'warn', '참고': 'note' };

const startPageName = (file) => {
  const m = file.match(SECTION_FILE);
  return m ? `${m[1]}-${m[2]}-Title.html` : file.replace(/\.md$/, '-Title.html');
};
const here0 = (num, title) => `${num ? num + ' ' : ''}${esc(title)}`;
const pad = (n) => String(n).padStart(2, '0');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const stripTags = (s) => unesc(s.replace(/<[^>]+>/g, ''));

function usage() {
  console.log(`사용법:
  node build.mjs <원고.md>                 절 하나 + 목차 페이지를 만든다
  node build.mjs --all <manuscript 폴더>   폴더의 모든 절 + 목차 페이지를 만든다
  옵션: --out <폴더>   출력 폴더 (기본값: manuscript 옆의 html/)`);
}

// ---------- index.md ----------

function parseIndex(text) {
  const book = { title: '', parts: [], chapters: new Map(), order: [] };
  let part = null;
  let chapter = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    let m;
    if (!line) continue;
    if ((m = line.match(/^#\s+(.+)$/))) {
      book.title = m[1];
    } else if ((m = line.match(/^##\s+(.+)$/))) {
      const pm = m[1].match(/^(\d+)부\.\s*(.+)$/);
      const [title, subtitle] = (pm ? pm[2] : m[1]).split(/\s+—\s+/);
      part = { num: pm ? Number(pm[1]) : null, label: pm ? `Part ${pad(pm[1])}` : m[1], title, subtitle: subtitle || '', chapters: [] };
      book.parts.push(part);
      chapter = null;
    } else if ((m = line.match(/^###\s+(.+)$/))) {
      if (!part) { part = { num: null, label: '', title: '', subtitle: '', chapters: [] }; book.parts.push(part); }
      const cm = m[1].match(/^(\d+)장\.\s*(.+)$/);
      chapter = { num: cm ? Number(cm[1]) : null, title: cm ? cm[2] : m[1], part, sections: [] };
      part.chapters.push(chapter);
      if (chapter.num != null) book.chapters.set(chapter.num, chapter);
    } else if ((m = line.match(/^(\d+)\.(\d+)\s+(.+)$/)) && chapter) {
      const s = { ch: Number(m[1]), sec: Number(m[2]), key: `${Number(m[1])}.${Number(m[2])}`, title: m[3] };
      chapter.sections.push(s);
      book.order.push(s);
    }
  }
  return book;
}

function loadSite(dir) {
  const indexPath = path.join(dir, 'index.md');
  const book = fs.existsSync(indexPath) ? parseIndex(fs.readFileSync(indexPath, 'utf8')) : null;
  const sections = fs.readdirSync(dir).filter((f) => SECTION_FILE.test(f)).sort().map((f) => {
    const m = f.match(SECTION_FILE);
    const ch = Number(m[1]);
    const sec = Number(m[2]);
    const key = `${ch}.${sec}`;
    const planned = book?.chapters.get(ch)?.sections.find((s) => s.sec === sec);
    let title = planned?.title;
    if (!title) {
      const h1 = fs.readFileSync(path.join(dir, f), 'utf8').match(/^#\s+(?:\d+\.\d+\s+)?(.+)$/m);
      title = h1 ? h1[1] : f;
    }
    return { file: f, html: f.replace(/\.md$/, '.html'), start: startPageName(f), ch, sec, key, title };
  });
  return { dir, book, sections, byKey: new Map(sections.map((s) => [s.key, s])) };
}

// ---------- 블록 파서 ----------

const isFence = (l) => /^\s*```/.test(l);
const isHeading = (l) => /^#{1,6}\s+/.test(l);
const isQuote = (l) => /^\s*>/.test(l);
const isHr = (l) => /^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(l);
const isTableStart = (l, next) => /^\s*\|/.test(l) && next !== undefined && /^\s*\|?\s*:?-{2,}/.test(next);
const isHtml = (l) => /^\s*<[a-zA-Z!/][^>]*>.*$/.test(l) && /^\s*</.test(l);
const IMAGE_LINE = /^\s*!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/;
const startsBlock = (l, next) => isFence(l) || isHeading(l) || isQuote(l) || isHr(l) || isTableStart(l, next) || LIST.test(l);

function parseBlocks(lines) {
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    let m;
    if (!line.trim()) { i++; continue; }
    if (isFence(line)) {
      const lang = line.trim().slice(3).trim();
      const body = [];
      i++;
      while (i < lines.length && !isFence(lines[i])) body.push(lines[i++]);
      i++;
      blocks.push({ type: 'code', lang, text: body.join('\n') });
    } else if ((m = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/))) {
      blocks.push({ type: 'heading', level: m[1].length, text: m[2] });
      i++;
    } else if (isHr(line)) {
      blocks.push({ type: 'hr' });
      i++;
    } else if (isQuote(line)) {
      const body = [];
      while (i < lines.length && isQuote(lines[i])) body.push(lines[i++].replace(/^\s*>\s?/, ''));
      blocks.push({ type: 'quote', raw: body.join('\n'), children: parseBlocks(body) });
    } else if (isTableStart(line, lines[i + 1])) {
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++]);
      blocks.push(parseTable(rows));
    } else if (LIST.test(line)) {
      const r = parseList(lines, i);
      blocks.push(r.block);
      i = r.next;
    } else if ((m = line.match(IMAGE_LINE))) {
      blocks.push({ type: 'figure', alt: m[1], src: m[2] });
      i++;
    } else if (isHtml(line)) {
      const body = [];
      while (i < lines.length && lines[i].trim()) body.push(lines[i++]);
      blocks.push({ type: 'html', text: body.join('\n') });
    } else {
      const body = [line];
      i++;
      while (i < lines.length && lines[i].trim() && !startsBlock(lines[i], lines[i + 1])) body.push(lines[i++]);
      blocks.push({ type: 'para', text: body.map((l) => l.replace(/^\s+/, '')).join('\n') });
    }
  }
  return blocks;
}

function parseList(lines, start) {
  const first = lines[start].match(LIST);
  const base = first[1].length;
  const ordered = /\d/.test(first[2]);
  const sameType = (mm) => /\d/.test(mm[2]) === ordered;
  const items = [];
  let cur = null;
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    const indent = line.match(/^\s*/)[0].length;
    const m = line.match(LIST);
    if (!line.trim()) {
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      if (j >= lines.length) break;
      const mj = lines[j].match(LIST);
      const ij = lines[j].match(/^\s*/)[0].length;
      if ((mj && mj[1].length === base && sameType(mj)) || ij > base) { if (cur) cur.lines.push(''); i = j; continue; }
      break;
    }
    if (m && m[1].length === base) {
      if (!sameType(m)) break;
      cur = { lines: [m[3]] }; items.push(cur); i++; continue; }
    if (cur && indent > base) { cur.lines.push(line.slice(Math.min(indent, base + 2))); i++; continue; }
    if (cur && !m && !startsBlock(line, lines[i + 1])) { cur.lines.push(line.trim()); i++; continue; }
    break;
  }
  return { block: { type: 'list', ordered, start: ordered ? parseInt(first[2], 10) : 1, items: items.map((it) => parseBlocks(it.lines)) }, next: i };
}

function splitRow(row) {
  let s = row.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  return s.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
}

function parseTable(rows) {
  const header = splitRow(rows[0]);
  const aligns = splitRow(rows[1]).map((c) => (c.startsWith(':') && c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : c.startsWith(':') ? 'left' : null));
  const body = rows.slice(2).map((r) => {
    const cells = splitRow(r);
    return header.map((_, k) => cells[k] ?? '');
  });
  return { type: 'table', header, aligns, body };
}

// ---------- 렌더러 ----------

function inline(text, ctx) {
  const codes = [];
  let s = text.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, src) => `<img class="inline-img" src="${ctx.resolveImage(unesc(src))}" alt="${alt}">`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) => `<a href="${esc(ctx.rewriteHref(unesc(href)))}">${t}</a>`);
  s = s.replace(/\*\*(.+?)\*\*/g, (_, t) => { if (ctx.onBold) ctx.onBold(stripTags(t)); return `<strong>${t}</strong>`; });
  s = s.replace(/(^|[^*\w])\*(?!\s)([^*]+?)\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/ {2,}\n/g, '<br>\n');
  s = s.replace(/\u0000(\d+)\u0000/g, (_, n) => `<code>${esc(codes[Number(n)])}</code>`);
  return s;
}

function slug(text, used) {
  const base = text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') || 'section';
  let id = base;
  let n = 2;
  while (used.has(id)) id = `${base}-${n++}`;
  used.add(id);
  return id;
}

function classifyQuote(block) {
  const firstPara = block.children[0]?.type === 'para' ? block.children[0] : null;
  if (!firstPara) return { kind: 'quote' };
  const fill = firstPara.text.match(/^✍️\s*\*\*\[채우기\]\*\*\s*/);
  if (fill) return { kind: 'fill', label: '✍️ 채우기', strip: fill[0] };
  const c = firstPara.text.match(/^\*\*(NOTE|TIP|궁금해요|주의|참고)\*\*\s*/i);
  if (c) {
    const name = /^[a-z]+$/i.test(c[1]) ? c[1].toUpperCase() : c[1];
    return { kind: CALLOUTS[name] || 'note', label: name, strip: c[0] };
  }
  return { kind: 'quote' };
}

function renderBlocks(blocks, ctx) {
  return blocks.map((b) => renderBlock(b, ctx)).join('\n');
}

function renderBlock(b, ctx) {
  switch (b.type) {
    case 'heading': {
      const html = inline(b.text, { ...ctx, onBold: null });
      if (b.level === 2 || b.level === 3) {
        const plain = stripTags(html);
        const id = slug(plain, ctx.used);
        ctx.toc.push({ level: b.level, id, text: plain });
        return `<h${b.level} id="${id}">${html}</h${b.level}>`;
      }
      const level = Math.min(6, Math.max(2, b.level));
      return `<h${level}>${html}</h${level}>`;
    }
    case 'para': {
      const interp = /^여기서부터는 내 해석이다/.test(b.text);
      const html = inline(b.text, { ...ctx, onBold: ctx.topLevel ? ctx.onBold : null });
      return `<p${interp ? ' class="interp"' : ''}>${html}</p>`;
    }
    case 'figure': {
      const f = ++ctx.n.fig;
      const label = ctx.figPrefix ? `그림 ${ctx.figPrefix}-${f}` : `그림 ${f}`;
      const alt = esc(b.alt);
      return `<figure class="fig"><button type="button" class="fig-zoom" aria-label="${alt} 크게 보기"><img src="${ctx.resolveImage(b.src)}" alt="${alt}" loading="lazy"></button><figcaption><span class="fig-num">${label}</span> ${alt}</figcaption></figure>`;
    }
    case 'quote': {
      const kind = classifyQuote(b);
      const sub = { ...ctx, topLevel: false, onBold: null };
      if (kind.kind === 'quote') return `<blockquote>${renderBlocks(b.children, sub)}</blockquote>`;
      const children = b.children.slice();
      children[0] = { ...children[0], text: children[0].text.slice(kind.strip.length) };
      if (!children[0].text.trim()) children.shift();
      const cls = kind.kind === 'fill' ? 'fill' : `callout callout-${kind.kind}`;
      return `<aside class="${cls}"><div class="callout-label">${esc(kind.label)}</div>${renderBlocks(children, sub)}</aside>`;
    }
    case 'list': {
      const tag = b.ordered ? 'ol' : 'ul';
      const start = b.ordered && b.start !== 1 ? ` start="${b.start}"` : '';
      const sub = { ...ctx, topLevel: false, onBold: null };
      const items = b.items.map((children) => {
        let head = '';
        let rest = children;
        if (children[0]?.type === 'para') {
          head = inline(children[0].text, sub);
          rest = children.slice(1);
          const task = head.match(/^\[( |x|X)\]\s*/);
          if (task) head = `<input type="checkbox" disabled${task[1] === ' ' ? '' : ' checked'}> ${head.slice(task[0].length)}`;
        }
        return `<li>${head}${rest.length ? '\n' + renderBlocks(rest, sub) : ''}</li>`;
      });
      return `<${tag}${start}>\n${items.join('\n')}\n</${tag}>`;
    }
    case 'table': {
      const sub = { ...ctx, topLevel: false, onBold: null };
      const worksheet = b.body.some((row) => row.every((c) => !c.trim()));
      const t = ctx.n.table++;
      const align = (k) => (b.aligns[k] ? ` style="text-align:${b.aligns[k]}"` : '');
      const head = b.header.map((c, k) => `<th${align(k)}>${inline(c, sub)}</th>`).join('');
      const rows = b.body.map((row, r) => `<tr>${row.map((c, k) => {
        if (worksheet && !c.trim()) return `<td class="ws-cell" contenteditable="true" data-cell="${t}-${r}-${k}"${align(k)}></td>`;
        return `<td${align(k)}>${inline(c, sub)}</td>`;
      }).join('')}</tr>`).join('\n');
      const table = `<table><thead><tr>${head}</tr></thead><tbody>\n${rows}\n</tbody></table>`;
      if (!worksheet) return `<div class="table-wrap">${table}</div>`;
      return `<div class="worksheet" data-table="${t}"><div class="ws-bar"><span>빈칸에 직접 적어 보세요. 적은 내용은 이 브라우저에만 저장됩니다.</span><button type="button" class="ws-clear">지우기</button></div><div class="table-wrap">${table}</div></div>`;
    }
    case 'code':
      return `<pre><code${b.lang ? ` class="lang-${esc(b.lang)}"` : ''}>${esc(b.text)}</code></pre>`;
    case 'hr':
      return '<hr>';
    case 'html':
      return b.text;
    default:
      return '';
  }
}

// ---------- 페이지 ----------

function makeCtx(mdPath, site, outDir, warnings) {
  const mdDir = path.dirname(mdPath);
  return {
    used: new Set(),
    toc: [],
    keywords: [],
    n: { fig: 0, table: 0 },
    figPrefix: '',
    topLevel: true,
    onBold: null,
    rewriteHref(href) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('#')) return href;
      const [p, hash] = href.split('#');
      const target = path.resolve(mdDir, p);
      const tail = hash ? `#${hash}` : '';
      if (target.endsWith('.md') && path.dirname(target) === site.dir) return path.basename(target, '.md') + '.html' + tail;
      return path.relative(outDir, target).split(path.sep).join('/') + tail;
    },
    resolveImage(src) {
      if (/^(https?:|data:)/i.test(src)) return src;
      const abs = path.resolve(mdDir, decodeURI(src));
      const mime = MIME[path.extname(abs).toLowerCase()];
      if (!fs.existsSync(abs)) {
        warnings.push(`이미지 없음: ${src} (${path.basename(mdPath)})`);
        return esc(src);
      }
      if (!mime) {
        warnings.push(`지원하지 않는 이미지 형식: ${src}`);
        return esc(path.relative(outDir, abs).split(path.sep).join('/'));
      }
      return `data:${mime};base64,${fs.readFileSync(abs).toString('base64')}`;
    },
  };
}

function fillTemplate(vars) {
  const tpl = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? vars[k] : ''));
}

function buildSection(mdPath, site, outDir, warnings) {
  const file = path.basename(mdPath);
  const fm = file.match(SECTION_FILE);
  const blocks = parseBlocks(fs.readFileSync(mdPath, 'utf8').split(/\r?\n/));
  const ctx = makeCtx(mdPath, site, outDir, warnings);
  ctx.onBold = (t) => { const k = t.trim(); if (k && !ctx.keywords.includes(k)) ctx.keywords.push(k); };

  let idx = 0;
  let h1 = '';
  if (blocks[0]?.type === 'heading' && blocks[0].level === 1) { h1 = blocks[0].text; idx = 1; }
  const nav = blocks[idx];
  if (nav?.type === 'quote' && /\]\([^)]*\.md(#[^)]*)?\)/.test(nav.raw) && nav.raw.length < 500) idx++;
  const firstH2 = blocks.findIndex((b, k) => k >= idx && b.type === 'heading' && b.level === 2);
  const leadBlocks = blocks.slice(idx, firstH2 === -1 ? blocks.length : firstH2);
  const bodyBlocks = firstH2 === -1 ? [] : blocks.slice(firstH2);

  const hm = h1.match(/^(\d+)\.(\d+)\s+(.+)$/);
  const ch = fm ? Number(fm[1]) : hm ? Number(hm[1]) : null;
  const sec = fm ? Number(fm[2]) : hm ? Number(hm[2]) : null;
  const title = hm ? hm[3] : h1 || file.replace(/\.md$/, '');
  const num = ch != null && sec != null ? `${ch}.${sec}` : '';
  ctx.figPrefix = num;

  const lead = renderBlocks(leadBlocks, ctx);
  const body = renderBlocks(bodyBlocks, ctx);
  const chapter = ch != null ? site.book?.chapters.get(ch) : null;
  const part = chapter?.part;

  const chapterLine = chapter
    ? `<div class="chapter-kicker">Chapter</div><div class="chapter-line"><span class="chapter-num">${pad(chapter.num)}</span><span class="chapter-title">${esc(chapter.title)}</span></div>`
    : '';
  const titleHtml = inline(title, { ...ctx, onBold: null });
  const sectionTitle = `<h1 class="section-title">${num ? `<span class="section-num">${num}</span> ` : ''}${titleHtml}</h1>`;
  const keywords = ctx.keywords.length
    ? `<section class="keywords"><h2 class="box-title">핵심 키워드</h2><ul>${ctx.keywords.map((k) => `<li>${esc(k)}</li>`).join('')}</ul></section>`
    : '';
  const bodyFile = file.replace(/\.md$/, '.html');
  const startFile = startPageName(file);
  const coverItems = chapter
    ? chapter.sections.map((s) => {
      const label = `${s.key} ${esc(s.title)}`;
      if (s.key === num) return `<li class="current" aria-current="page"><a href="${bodyFile}">${label}</a></li>`;
      const f = site.byKey.get(s.key);
      return f ? `<li><a href="${f.start}">${label}</a></li>` : `<li class="todo">${label}</li>`;
    }).join('')
    : `<li class="current"><a href="${bodyFile}">${here0(num, title)}</a></li>`;
  const cover = `<div class="part-panel cover"><div class="part-label">${esc(part?.label || site.book?.title || '')}</div><div class="part-title">${esc(part?.title || title)}</div>${part?.subtitle ? `<div class="part-sub">${esc(part.subtitle)}</div>` : ''}<ol class="panel-sections">${coverItems}</ol></div>`;

  const toc = ctx.toc.length
    ? `<nav class="toc" aria-label="이 절의 구성"><div class="toc-title">이 절의 구성</div><ol>${ctx.toc.map((t) => `<li class="lv${t.level}"><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></nav>`
    : '';

  const pos = site.sections.findIndex((s) => s.file === file);
  const prev = pos > 0 ? site.sections[pos - 1] : null;
  const next = pos >= 0 && pos < site.sections.length - 1 ? site.sections[pos + 1] : null;
  let nextPlanned = null;
  if (!next && site.book && num) {
    const k = site.book.order.findIndex((s) => s.key === num);
    nextPlanned = k >= 0 ? site.book.order[k + 1] : null;
  }
  const hasIndex = Boolean(site.book);
  const card = (dir, href, label, t) => (href
    ? `<a class="pager-card ${dir}" href="${href}"><span class="pager-dir">${label}</span><span class="pager-title">${t}</span></a>`
    : `<div class="pager-card ${dir} disabled"><span class="pager-dir">${label}</span><span class="pager-title">${t}</span></div>`);
  const here = here0(num, title);

  const titlePrev = prev
    ? card('prev', prev.html, '이전', `${prev.key} ${esc(prev.title)}`)
    : hasIndex ? card('prev', 'index.html', '처음으로', '목차') : '<div></div>';
  const titleNext = card('next', bodyFile, '본문', here);
  const bodyPrev = card('prev', startFile, '이 절의 시작', here);
  const bodyNext = next
    ? card('next', next.start, '다음', `${next.key} ${esc(next.title)}`)
    : nextPlanned ? card('next', null, '다음 · 작성 예정', `${nextPlanned.key} ${esc(nextPlanned.title)}`) : '<div></div>';

  const crumbParts = [];
  if (hasIndex) crumbParts.push('<a href="index.html">목차</a>');
  if (part?.label) crumbParts.push(esc(part.label));
  if (chapter) crumbParts.push(`${chapter.num}장 ${esc(chapter.title)}`);
  const crumb = crumbParts.join('<span class="crumb-sep">›</span>');
  const foot = chapter ? `${pad(chapter.num)} ${esc(chapter.title)}${part?.label ? `<span class="sep">·</span>${esc(part.label)} ${esc(part.title)}` : ''}` : esc(site.book?.title || '');
  const pager = (a, b) => `<nav class="pager" aria-label="이전 다음">${a}${b}</nav>\n<footer class="page-foot">${foot}</footer>`;

  const titleMain = `<main class="cover-wrap">${cover}</main>
${pager(titlePrev, titleNext)}`;

  const bodyMain = `<header class="opener${toc ? '' : ' no-toc'}"><div class="chapter-head">${chapterLine}${sectionTitle}<div class="lead">${lead}</div>${keywords}</div></header>
<div class="layout${toc ? '' : ' no-toc'}">${toc}<article class="content">
${body}
</article></div>
${pager(bodyPrev, bodyNext)}`;

  const description = stripTags(lead).replace(/\s+/g, ' ').trim().slice(0, 150);
  const fullTitle = `${num ? num + ' ' : ''}${title}${site.book?.title ? ` — ${site.book.title}` : ''}`;
  const page = (id, kind, main) => fillTemplate({
    TITLE: esc(fullTitle),
    DESCRIPTION: esc(description),
    PAGE_ID: esc(id),
    PAGE_KIND: kind,
    CRUMB: crumb,
    MAIN: main,
  });
  return [
    { name: startFile, html: page(startFile.replace(/\.html$/, ''), 'title', titleMain) },
    { name: bodyFile, html: page(bodyFile.replace(/\.html$/, ''), 'section', bodyMain) },
  ];
}

function buildIndex(site) {
  const { book } = site;
  const total = book.order.length;
  const done = book.order.filter((s) => site.byKey.has(s.key)).length;
  const parts = book.parts.map((part) => {
    const chapters = part.chapters.map((c) => {
      const items = c.sections.map((s) => {
        const f = site.byKey.get(s.key);
        return f
          ? `<li class="done"><a href="${f.start}"><span class="sec-num">${s.key}</span>${esc(s.title)}</a></li>`
          : `<li class="todo"><span class="sec-num">${s.key}</span>${esc(s.title)}<em>작성 예정</em></li>`;
      }).join('');
      const head = c.num != null ? `<span class="toc-ch-num">${pad(c.num)}</span>${esc(c.title)}` : esc(c.title);
      return `<div class="toc-chapter"><h3>${head}</h3>${items ? `<ol>${items}</ol>` : ''}</div>`;
    }).join('');
    return `<section class="toc-part"><div class="toc-part-panel">${part.num != null ? `<div class="part-label">${esc(part.label)}</div>` : ''}<h2>${esc(part.title || part.label)}</h2>${part.subtitle ? `<p>${esc(part.subtitle)}</p>` : ''}</div><div class="toc-chapters">${chapters}</div></section>`;
  }).join('\n');
  const pct = total ? Math.round((done / total) * 100) : 0;
  const main = `<header class="book-hero"><div class="kicker">Contents</div><h1>${esc(book.title)}</h1><div class="book-progress"><div class="book-progress-bar"><span style="width:${pct}%"></span></div><span>작성한 절 ${done} / ${total}</span></div></header>
<main class="book-toc">
${parts}
</main>
<footer class="page-foot">${esc(book.title)}</footer>`;
  return fillTemplate({
    TITLE: esc(`목차 — ${book.title}`),
    DESCRIPTION: esc(`${book.title} 목차`),
    PAGE_ID: 'index',
    PAGE_KIND: 'index',
    CRUMB: '<span>목차</span>',
    MAIN: main,
  });
}

// ---------- main ----------

function main() {
  const args = process.argv.slice(2);
  let outDir = null;
  let all = false;
  const inputs = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--out') outDir = args[++i];
    else if (args[i] === '--all') all = true;
    else if (args[i] === '-h' || args[i] === '--help') { usage(); return; }
    else inputs.push(args[i]);
  }
  if (!inputs.length) { usage(); process.exitCode = 1; return; }

  const target = path.resolve(inputs[0]);
  if (!fs.existsSync(target)) { console.error(`없는 경로: ${inputs[0]}`); process.exitCode = 1; return; }
  const isDir = fs.statSync(target).isDirectory();
  const dir = isDir ? target : path.dirname(target);
  const site = loadSite(dir);
  let files;
  if (all || isDir) files = site.sections.map((s) => path.join(dir, s.file));
  else files = path.basename(target) === 'index.md' ? [] : [target];

  const out = path.resolve(outDir || path.join(dir, '..', 'html'));
  fs.mkdirSync(out, { recursive: true });
  const warnings = [];
  const written = [];
  for (const f of files) {
    for (const p of buildSection(f, site, out, warnings)) {
      const dest = path.join(out, p.name);
      fs.writeFileSync(dest, p.html);
      written.push(dest);
    }
  }
  if (site.book) {
    const dest = path.join(out, 'index.html');
    fs.writeFileSync(dest, buildIndex(site));
    written.push(dest);
  }
  for (const w of written) console.log(`만듦: ${path.relative(process.cwd(), w)}`);
  for (const w of warnings) console.warn(`경고: ${w}`);
}

main();
