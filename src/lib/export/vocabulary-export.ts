import { VocabularyItem } from '@/types/database';
import { getMnemonicForWord } from '@/lib/dictionary/mnemonics-db';

/**
 * Generate Anki-ready Tab-Separated Values (TSV) — premium card design.
 * Front: Word + IPA + CEFR badge
 * Back: Uzbek (large) + Definition + Context + Collocations + Mnemonic
 */
export function exportToAnkiTSV(words: VocabularyItem[]): string {
  const lines: string[] = [];
  lines.push('#separator:tab');
  lines.push('#html:true');
  lines.push('#tags column:5');

  for (const w of words) {
    const lemma  = w.lemma || w.word;
    const ipa    = w.phoneticIpa || w.pronunciationIpa || '';
    const translation = w.translationUz || '';
    const def    = w.definitionEn || '';
    const context = w.contextSentence || '';
    const cefr   = w.cefrLevel || 'C1';
    const band   = w.ieltsBand || 7.5;
    const colls  = (w.collocations || []).slice(0, 4).map(c =>
      `<span style="display:inline-block;background:#DCE9DF;color:#18231F;border-radius:4px;padding:2px 7px;font-size:11px;margin:2px;">${c}</span>`
    ).join(' ');

    const mnemonic = getMnemonicForWord(lemma);
    const mnemonicHtml = mnemonic
      ? `<div style="margin-top:10px;padding:8px 10px;background:#F0F7F3;border-left:3px solid #315C4A;border-radius:0 6px 6px 0;font-size:12px;color:#315C4A;">
           💡 <b>Eslab qolish:</b> ${mnemonic.hookUz}<br>
           <span style="color:#555;">${mnemonic.association}</span>
         </div>`
      : '';

    const cefrBadge = `<span style="display:inline-block;background:#315C4A;color:#fff;border-radius:4px;padding:1px 7px;font-size:11px;font-weight:700;letter-spacing:.5px;">${cefr}</span>`;
    const bandBadge = `<span style="display:inline-block;background:#F7F6F0;color:#315C4A;border:1px solid #315C4A;border-radius:4px;padding:1px 7px;font-size:11px;font-weight:600;">Band ${band}</span>`;

    const front = `
      <div style="font-family:'Georgia',serif;text-align:center;padding:16px 8px;">
        <div style="font-size:28px;font-weight:700;color:#18231F;letter-spacing:-.5px;">${lemma}</div>
        ${ipa ? `<div style="font-size:15px;color:#888;margin:4px 0;">${ipa}</div>` : ''}
        <div style="margin-top:8px;">${cefrBadge} &nbsp; ${bandBadge}</div>
      </div>`;

    const back = `
      <div style="font-family:sans-serif;padding:12px;">
        <div style="font-size:22px;font-weight:700;color:#315C4A;text-align:center;padding-bottom:10px;border-bottom:1px solid #DCE9DF;">${translation}</div>
        <div style="margin-top:10px;font-size:13px;color:#333;line-height:1.6;">${def}</div>
        ${context ? `<div style="margin-top:10px;font-size:12px;color:#555;border-left:3px solid #315C4A;padding-left:10px;font-style:italic;">"${context}"</div>` : ''}
        ${colls ? `<div style="margin-top:10px;">${colls}</div>` : ''}
        ${mnemonicHtml}
        <div style="margin-top:12px;text-align:right;font-size:10px;color:#aaa;">LexiPath · IELTS Vocabulary</div>
      </div>`;

    const tags = `LexiPath CEFR_${cefr} Band_${band}`;
    lines.push([front, back, cefr, `Band ${band}`, tags].join('\t'));
  }

  return lines.join('\n');
}

/**
 * Generate richly-formatted Telegram Markdown v2 post for Uzbek IELTS channels.
 */
export function exportToTelegramPost(word: VocabularyItem): string {
  const lemma       = word.lemma || word.word;
  const ipa         = word.phoneticIpa || word.pronunciationIpa || '';
  const translation = word.translationUz || '';
  const def         = word.definitionEn || '';
  const context     = word.contextSentence || '';
  const collocations = (word.collocations || []).slice(0, 4);
  const cefr        = word.cefrLevel || 'C1';
  const band        = word.ieltsBand || 7.5;
  const mnemonic    = getMnemonicForWord(lemma);

  const divider = '━━━━━━━━━━━━━━━━━';

  let post = `📘 *LexiPath — Kunlik So'z*\n`;
  post += `${divider}\n\n`;
  post += `🔤 *${lemma.toUpperCase()}*`;
  if (ipa) post += ` \`${ipa}\``;
  post += `\n`;
  post += `🏷 CEFR *${cefr}* · IELTS Band *${band}*\n\n`;
  post += `🇺🇿 *O'zbekcha ma'nosi:*\n`;
  post += `➤ ${translation}\n\n`;
  post += `📖 *Inglizcha ta'rifi:*\n`;
  post += `_${def}_\n\n`;

  if (context) {
    post += `💬 *Kontekstda misol:*\n`;
    post += `❝ _${context}_ ❞\n\n`;
  }

  if (collocations.length > 0) {
    post += `🔗 *Kollokatsiyalar:*\n`;
    collocations.forEach(c => { post += `  · \`${c}\`\n`; });
    post += '\n';
  }

  if (mnemonic) {
    post += `💡 *Eslab qolish kaliti:*\n`;
    post += `${mnemonic.hookUz}\n`;
    post += `_${mnemonic.association}_\n\n`;
  }

  post += `${divider}\n`;
  post += `#LexiPath #IELTS #${cefr} #IELTS_${band.toString().replace('.', '_')} #UzbekLearners #Vocabulary`;

  return post;
}

/**
 * Trigger browser file download
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
