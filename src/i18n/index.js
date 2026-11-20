const dict = {
  vi: require('./vi.json'),
  en: require('./en.json')
};

function get(obj, key) {
  return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function t(locale, key, vars) {
  let val = get(dict[locale], key);
  if (val === undefined) val = get(dict.vi, key);
  if (val === undefined) return key;
  if (vars && typeof val === 'string') {
    val = val.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`));
  }
  return val;
}

module.exports = { t, dict };
