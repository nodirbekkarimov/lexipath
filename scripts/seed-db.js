const { createClient } = require('@supabase/supabase-js');
const { SEED_VOCABULARY, SEED_PASSAGES, SEED_QUIZ_QUESTIONS } = require('./dist/data/seed-data.js');

const url = 'https://wqmqcfwkgezsifrsrdem.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbXFjZndrZ2V6c2lmcnNyZGVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzM3MjY5OSwiZXhwIjoyMTA4OTQ4Njk5fQ.CmDE8qn-bvKHd4TkIBC71hA40b36FFkOHL9zTDu8EgE';

const supabase = createClient(url, key);

async function runSeed() {
  console.log('--- Starting Fast Batch Seeding ---');

  // 1. Prepare and insert words
  const wordsToInsert = SEED_VOCABULARY.map(item => ({
    lemma: item.lemma || item.word,
    part_of_speech: item.pos || item.partOfSpeech || 'noun',
    phonetic_ipa: item.phoneticIpa || item.pronunciationIpa || null,
    cefr_level: item.cefrLevel || 'B2',
    ielts_topic: item.topic || item.ieltsTopic || null,
    is_published: true,
  }));

  const { data: insertedWords, error: wErr } = await supabase
    .from('vocabulary_words')
    .upsert(wordsToInsert, { onConflict: 'lemma' })
    .select('id, lemma');

  if (wErr) {
    console.error('Error inserting words:', wErr.message);
    return;
  }

  console.log(`✓ Inserted/updated ${insertedWords.length} words`);
  const wordMap = Object.fromEntries(insertedWords.map(w => [w.lemma, w.id]));

  // 2. Prepare child rows in batches
  const defs = [];
  const exs = [];
  const colls = [];
  const forms = [];

  for (const item of SEED_VOCABULARY) {
    const lemma = item.lemma || item.word;
    const wordId = wordMap[lemma];
    if (!wordId) continue;

    if (item.definitionEn) {
      defs.push({
        word_id: wordId,
        definition_en: item.definitionEn,
        definition_uz: item.translationUz || null,
        definition_order: 1,
        is_primary: true,
      });
    }

    const sentences = [item.contextSentence, ...(item.additionalExamples || [])].filter(Boolean);
    for (const s of sentences) {
      exs.push({
        word_id: wordId,
        sentence: s,
        source: 'IELTS Academic Corpus',
      });
    }

    if (Array.isArray(item.collocations)) {
      for (const c of item.collocations) {
        colls.push({ word_id: wordId, collocation: c });
      }
    }

    if (item.wordForms && typeof item.wordForms === 'object') {
      for (const [formType, formVal] of Object.entries(item.wordForms)) {
        if (typeof formVal === 'string' && formVal.trim()) {
          forms.push({ word_id: wordId, form_type: formType, form_value: formVal });
        }
      }
    }
  }

  if (defs.length) {
    await supabase.from('word_definitions').insert(defs);
    console.log(`✓ Inserted ${defs.length} definitions`);
  }
  if (exs.length) {
    await supabase.from('word_examples').insert(exs);
    console.log(`✓ Inserted ${exs.length} examples`);
  }
  if (colls.length) {
    await supabase.from('word_collocations').insert(colls);
    console.log(`✓ Inserted ${colls.length} collocations`);
  }
  if (forms.length) {
    await supabase.from('word_forms').insert(forms);
    console.log(`✓ Inserted ${forms.length} word forms`);
  }

  // 3. Insert Passages
  const passagesToInsert = SEED_PASSAGES.map(p => ({
    title: p.title,
    content_markdown: p.contentMarkdown,
    source: 'LexiPath Editorial',
    author: 'LexiPath Academic Team',
    difficulty: p.cefrLevel === 'C2' ? 'hard' : p.cefrLevel === 'C1' ? 'medium' : 'easy',
    cefr_level: p.cefrLevel || 'B2',
    ielts_topic: p.topic || null,
    estimated_reading_minutes: p.estimatedReadingMinutes || 5,
    word_count: p.wordCount || 450,
    is_published: true,
  }));

  const { data: insertedPassages, error: pErr } = await supabase
    .from('reading_passages')
    .insert(passagesToInsert)
    .select('id, title');

  if (pErr) {
    console.error('Error inserting passages:', pErr.message);
  } else {
    console.log(`✓ Inserted ${insertedPassages.length} reading passages`);

    // Insert questions for first passage
    const p0 = insertedPassages[0];
    if (p0 && SEED_PASSAGES[0]?.questions) {
      const qRows = SEED_PASSAGES[0].questions.map((q, idx) => ({
        passage_id: p0.id,
        question_text: q.prompt || q.questionText,
        question_type: q.type || 'multiple_choice',
        correct_answer: q.correctAnswer,
        explanation: q.explanationUz || q.explanation || null,
        question_order: idx + 1,
      }));
      await supabase.from('reading_questions').insert(qRows);
      console.log(`✓ Inserted ${qRows.length} comprehension questions for "${p0.title}"`);
    }
  }

  // 4. Insert Quiz Questions
  const firstWordId = insertedWords[0]?.id;
  if (firstWordId && SEED_QUIZ_QUESTIONS.length) {
    for (const q of SEED_QUIZ_QUESTIONS) {
      const wordId = wordMap[q.targetWord] || firstWordId;
      const { data: qData } = await supabase
        .from('quiz_questions')
        .insert({
          word_id: wordId,
          question_type: 'multiple_choice',
          prompt: q.prompt || q.questionText,
          correct_answer: q.correctAnswer,
          explanation_uz: q.explanationUz || q.explanation || null,
          difficulty: 3,
          is_active: true,
        })
        .select()
        .single();

      if (qData && Array.isArray(q.options)) {
        const opts = q.options.map((optText, i) => ({
          question_id: qData.id,
          option_text: optText,
          is_correct: optText === q.correctAnswer,
          option_order: i + 1,
        }));
        await supabase.from('quiz_options').insert(opts);
      }
    }
    console.log(`✓ Inserted ${SEED_QUIZ_QUESTIONS.length} quiz questions with options`);
  }

  console.log('\n--- Batch Seeding Complete! ---');
}

runSeed().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
