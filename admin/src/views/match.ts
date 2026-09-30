/** Case-insensitive (Turkish locale) search over a record's fields, as in the prototype. */
export const matcher = (q: string) => {
  const s = q.trim().toLocaleLowerCase('tr');
  return (fields: (string | number)[]) => !s || fields.join(' ').toLocaleLowerCase('tr').includes(s);
};
