export function hs(str: string) {
  // tslint:disable-next-line:variable-name
  const _arr: Array<string> = str.split('-');
  return _arr
    .map((a: string) => `${a.charAt(0).toUpperCase()}${a.slice(1, a.length)}`)
    .join(' ');
}
