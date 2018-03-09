
let COUNT = 0;

export default function generateID(prefix = 'unique_id_') {
  return `${prefix}${COUNT++}`;
}
