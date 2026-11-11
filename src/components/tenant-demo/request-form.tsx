"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

/**
 * CREATE A REQUEST — prototype only (OWNER demo §8): category · description · photo attachment UI. Nothing is sent and nothing is
 * stored: the photos stay in the browser (object URLs, revoked on change / unmount); «Создать обращение» shows a prototype result
 * that says so and what the real cabinet will do — never «обращение принято» or a fake number.
 */
type Photo = { name: string; url: string };
const N = " ";

export function RequestForm({ categories, back }: { categories: string[]; back: string }) {
  const [category, setCategory] = useState("");
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errors, setErrors] = useState<{ category?: string; text?: string }>({});
  const [done, setDone] = useState(false);
  const urls = useRef<string[]>([]);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);
  useEffect(() => { if (done) resultRef.current?.focus(); }, [done]);

  const pick = (files: FileList | null) => {
    urls.current.forEach((u) => URL.revokeObjectURL(u));
    const next = [...(files ?? [])].filter((f) => f.type.startsWith("image/")).slice(0, 5).map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    urls.current = next.map((p) => p.url);
    setPhotos(next);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const e: typeof errors = {};
    if (!category) e.category = "Выберите категорию.";
    if (text.trim().length < 10) e.text = `Опишите проблему хотя бы в${N}одном предложении.`;
    setErrors(e);
    if (!Object.keys(e).length) setDone(true);
  };

  if (done) {
    return (
      <div className="tc-result" ref={resultRef} tabIndex={-1} role="status">
        <p className="tc-label">Прототип · ничего не отправлено</p>
        <h2 className="tc-h2">Обращение сформировано в{N}демо, но{N}не{N}отправлено.</h2>
        <dl className="tc-sheet tc-sheet--compact">
          <div><dt>Категория</dt><dd>{category}</dd></div>
          <div><dt>Описание</dt><dd>{text}</dd></div>
          <div><dt>Фото</dt><dd>{photos.length ? photos.map((p) => p.name).join(", ") : "без фото"}</dd></div>
        </dl>
        <p className="tc-note">{`В${N}рабочей версии обращение получит номер, статус «Получено» и${N}ответственную службу; арендатор увидит каждое изменение статуса в${N}разделе «Обращения».`}</p>
        <div className="tc-pay__actions">
          <button type="button" className="btn btn--ghost" onClick={() => setDone(false)}>Изменить</button>
          <Link className="tc-link" href={back}>К обращениям →</Link>
        </div>
      </div>
    );
  }

  return (
    <form className="tc-form" onSubmit={submit} noValidate>
      <fieldset className="tc-form__group" aria-describedby={errors.category ? "tc-err-cat" : undefined}>
        <legend className="tc-form__label">Категория</legend>
        <div className="tc-choices">
          {categories.map((c) => (
            <label key={c} className="tc-choice">
              <input type="radio" name="category" value={c} checked={category === c} onChange={() => setCategory(c)} />
              <span>{c}</span>
            </label>
          ))}
        </div>
        {errors.category ? <p className="tc-form__error" id="tc-err-cat">{errors.category}</p> : null}
      </fieldset>

      <div className="tc-form__group">
        <label className="tc-form__label" htmlFor="tc-text">Описание</label>
        <textarea id="tc-text" className="tc-input" rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder={`Например: в${N}входной зоне не${N}горят два светильника у${N}двери.`} aria-invalid={errors.text ? true : undefined} aria-describedby={errors.text ? "tc-err-text" : undefined} />
        {errors.text ? <p className="tc-form__error" id="tc-err-text">{errors.text}</p> : null}
      </div>

      <div className="tc-form__group">
        <span className="tc-form__label">Фото</span>
        <label className="tc-attach">
          <input type="file" accept="image/*" multiple onChange={(e) => pick(e.target.files)} />
          <span className="tc-attach__btn">Прикрепить фото</span>
          <span className="tc-attach__hint">до{N}5 изображений · остаются в{N}вашем браузере</span>
        </label>
        {photos.length ? (
          <ul className="tc-thumbs">
            {photos.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element -- a local object URL preview, never uploaded
              <li key={p.url}><img src={p.url} alt={p.name} /><span>{p.name}</span></li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="tc-form__submit">
        <button type="submit" className="btn">Создать обращение</button>
        <p className="tc-form__proto">Прототип: обращение не{N}отправляется.</p>
      </div>
    </form>
  );
}
