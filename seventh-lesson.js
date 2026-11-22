(function (root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.RBSeventhLesson = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SECTION_LABELS = {
    'А': 'A',
    'В': 'B',
    'С': 'C',
  };

  function groupForWeekday(day) {
    if (day === 1 || day === 3) return 'mw';
    if (day === 2 || day === 4) return 'tth';
    return '';
  }

  function classOptions(classes) {
    if (!Array.isArray(classes)) return [];

    return classes
      .filter((value) => typeof value === 'string')
      .map((value) => {
        const match = /^([1-6])-([АВС])$/.exec(value);
        if (!match) return null;

        const grade = Number(match[1]);

        return {
          value,
          label: `${grade}${SECTION_LABELS[match[2]]}`,
          grade,
          section: SECTION_LABELS[match[2]],
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.grade - b.grade || a.section.localeCompare(b.section))
      .map(({ value, label }) => ({ value, label }));
  }

  function addMembers(existing, additions) {
    const result = Array.isArray(existing) ? existing.slice() : [];
    const seen = new Set(
      result.map((member) => JSON.stringify([member.class, member.id])),
    );

    if (!Array.isArray(additions)) return result;
    additions.forEach((member) => {
      const identity = JSON.stringify([member.class, member.id]);
      if (!seen.has(identity)) {
        seen.add(identity);
        result.push(member);
      }
    });

    return result;
  }

  function removeMember(existing, target) {
    if (!Array.isArray(existing)) return [];
    return existing.filter(
      (member) => member.class !== target.class || member.id !== target.id,
    );
  }

  return {
    groupForWeekday,
    classOptions,
    addMembers,
    removeMember,
  };
});
