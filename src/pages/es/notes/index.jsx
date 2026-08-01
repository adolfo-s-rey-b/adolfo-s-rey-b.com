import NotesIndexView from '../../../views/NotesIndexView';
import { notesIndexProps } from '../../../lib/props/notes';

export default NotesIndexView;

export async function getStaticProps() {
  return { props: notesIndexProps('es') };
}
